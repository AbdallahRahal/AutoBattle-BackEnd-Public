import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as net from 'net';

export class DockerManager {
    public static reservedPorts = new Set<number>();

    private ipAddress = '35.180.130.202'; // IP publique de votre instance EC2


    private getPrivateKey() {
        const privateKeyPath = path.resolve(__dirname, '../keys/ec2KeyPair.pem');
        if (!fs.existsSync(privateKeyPath)) {
            throw new Error(`Fichier PEM non trouvé : ${privateKeyPath}`);
        }
        return fs.readFileSync(privateKeyPath, 'utf-8');

    }

    private async findFreePort(conn: Client): Promise<number> {
        return new Promise((resolve, reject) => {
            const startPort = 3000;
            const endPort = 4000;

            // Commande pour vérifier les ports déjà utilisés
            const command = `docker ps --format "{{.Ports}}" | grep -oE "0.0.0.0:[0-9]+" | awk -F ":" '{print $2}'`;

            conn.exec(command, (err, stream) => {
                if (err) return reject(err);

                let usedPorts: number[] = [];

                stream.on('data', (data) => {
                    const ports = data
                        .toString()
                        .split('\n')
                        .map((port) => parseInt(port.trim(), 10));
                    usedPorts = usedPorts.concat(ports.filter((port) => !isNaN(port)));
                });

                stream.on('close', () => {
                    for (let port = startPort; port <= endPort; port++) {
                        if (!usedPorts.includes(port) && !DockerManager.reservedPorts.has(port)) {
                            DockerManager.reservedPorts.add(port); // Réserve le port immédiatement
                            return resolve(port);
                        }
                    }
                    return reject(new Error('No free ports available in the specified range.'));
                });

                stream.stderr.on('data', (data) => {
                });
            });
        });
    }
    private async findFreeLocalPort(): Promise<number> {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.listen(0, () => {
                const address = server.address();
                if (typeof address === 'string' || !address) {
                    reject(new Error('Failed to find a free port.'));
                    return;
                }
                const port = address.port;
                server.close(() => resolve(port));
            });

            server.on('error', reject);
        });
    }

    private async launchFightContainerLocal(randomToken: string): Promise<{ ip: string; port: number; containerId: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                const freePort = await this.findFreeLocalPort(); // Trouver un port libre en local

                const dockerCommand = `
                docker run -d -p ${freePort}:3002 -e FIGHT_TOKEN=${randomToken}  -e RUN_ENV=local -e NODE_ENV=development  578396822038.dkr.ecr.eu-west-3.amazonaws.com/autobattle-fightengine:latest
            `;


                exec(dockerCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error executing Docker command:', error);
                        return reject(error);
                    }
                    if (stderr) {
                        console.warn('Docker stderr:', stderr);
                    }

                    const containerId = stdout.trim();
                    if (!containerId) {
                        return reject(new Error('Failed to retrieve container ID.'));
                    }
                    resolve({ ip: '127.0.0.1', port: freePort, containerId });
                });
            } catch (error) {
                console.error('Error launching local fight container:', error);
                reject(error);
            }
        });
    }


    public async launchFightContainer(randomToken: string): Promise<{ ip: string; port: number; containerId: string }> {
        if (process.env.NODE_ENV === 'development') {
            console.log('launchFightContainer en local');
            return await this.launchFightContainerLocal(randomToken)
        }
        const conn = new Client();

        return new Promise((resolve, reject) => {
            try {

                conn.on('ready', async () => {
                    try {
                        const freePort = await this.findFreePort(conn);

                        const dockerCommand = `
                        aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 578396822038.dkr.ecr.eu-west-3.amazonaws.com && \
                        docker pull 578396822038.dkr.ecr.eu-west-3.amazonaws.com/autobattle-fightengine:latest && \
                        docker run -d -p ${freePort}:3002 \
                            -e FIGHT_TOKEN=${randomToken} \
                            -v /etc/letsencrypt/live/ws.autobattle.app/fullchain.pem:/cert/fullchain.pem \
                            -v /etc/letsencrypt/live/ws.autobattle.app/privkey.pem:/cert/privkey.pem \
                            578396822038.dkr.ecr.eu-west-3.amazonaws.com/autobattle-fightengine:latest
                        `;

                        conn.exec(dockerCommand, (err, stream) => {
                            if (err) {
                                console.error('Error executing Docker command:', err);
                                conn.end();
                                return reject(err);
                            }

                            let containerId = '';

                            stream.on('data', (data) => {
                                const output = data.toString().trim();
                                const lines = output.split('\n');
                                containerId = lines[lines.length - 1].trim();
                            });

                            stream.on('close', () => {
                                if (!containerId) {
                                    console.error('Failed to retrieve container ID.');
                                    conn.end();
                                    return reject(new Error('Failed to retrieve container ID.'));
                                }
                                conn.end();
                                resolve({ ip: this.ipAddress, port: freePort, containerId });
                            });
                        });
                    } catch (error) {
                        console.error('Error during port allocation or container launch:', error);
                        conn.end();
                        reject(error);
                    }
                });

                conn.on('error', (err) => {
                    console.error('SSH connection error:', err);
                    reject(err);
                });

                conn.connect({
                    host: this.ipAddress,
                    username: 'ec2-user',
                    privateKey: this.getPrivateKey(),
                });
            } catch (error) {
                console.error('Error starting fight container:', error.message);
                reject(error);
            }
        });
    }

    public async stopFightContainer(containerId: string): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            console.log('abort stopFightContainer due to local running');
            return
        }

        try {
            const conn = new Client();

            return new Promise((resolve, reject) => {
                conn.on('ready', () => {
                    console.log('SSH connection established for stopping container', containerId);

                    const dockerStopCommand = `docker stop ${containerId} && docker rm ${containerId}`;

                    conn.exec(dockerStopCommand, (err, stream) => {
                        if (err) {
                            console.error('Error executing Docker stop command:', err);
                            conn.end();
                            return reject(err);
                        }

                        stream.on('data', (data) => { });
                        stream.stderr.on('data', (data) => console.error(`STDERR: ${data}`));

                        stream.on('close', (code, signal) => {
                            if (code === 0) {
                                resolve();
                            } else {
                                console.error(`Command exited with code ${code} and signal ${signal}`);
                                reject(new Error(`Failed to stop/remove container: ${containerId}`));
                            }
                            conn.end();
                        });
                    });
                });

                conn.on('error', (err) => {
                    conn.end();
                    reject(err);
                });

                conn.on('close', () => {
                });

                try {
                    conn.connect({
                        host: this.ipAddress,
                        username: 'ec2-user',
                        privateKey: this.getPrivateKey(),
                    });
                } catch (error) {
                    console.error('Error connecting to SSH:', error.message);
                    conn.end();
                    reject(error);
                }
            });

        } catch (error) {
            console.log('Error stopFightContainer : ', error)
        }
    }

}    