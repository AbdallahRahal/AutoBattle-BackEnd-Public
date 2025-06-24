import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationEvent, NotificationPayloads } from '@autobattle/common/models';

const BOT_ROOM = "BOT";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@Injectable()
export class NotificationGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private pingInterval: NodeJS.Timeout | null = null;

  constructor(private jwtService: JwtService) { }

  onModuleInit() {
    this.server.on("connection", async (socket: Socket) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        console.log("No token, disconnecting socket");
        socket.disconnect();
        return;
      }

      // Vérifie si c'est l'API KEY du bot
      if (token === process.env.BOT_API_KEY) {
        socket.join(BOT_ROOM);

        socket.on("disconnect", () => {
        });

        return;
      }

      // Sinon, on considère que c'est un JWT
      try {
        const payload = this.jwtService.verify(token);
        socket.join(payload.sub);

        socket.on("disconnect", () => {
        });
      } catch (e) {
        console.log("Invalid token, disconnecting socket");
        socket.disconnect();
      }
    });

    // ✅ Lancer le ping automatique
    this.startPing();
  }

  onModuleDestroy() {
    this.stopPing();
  }

  // ✅ PING AUTOMATIQUE
  private startPing() {
    this.pingInterval = setInterval(() => {
      // Envoie un "ping" à tous les clients connectés (bots + users)
      this.server.emit("ping");
    }, 10000); // Toutes les 10 secondes (modifiable)
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // ✅ Notifier un utilisateur spécifique
  notifyUser<K extends NotificationEvent>(userId: string, event: K, data: NotificationPayloads[K]) {
    this.server.to(userId).emit(event, data);
  }

  // ✅ Notifier le bot
  notifyBot<K extends NotificationEvent>(event: K, data: NotificationPayloads[K]) {
    this.server.to(BOT_ROOM).emit(event, data);
  }

  // ✅ Notifier tout le monde
  notifyAll<K extends NotificationEvent>(event: K, data: NotificationPayloads[K]) {
    this.server.emit(event, data);
  }
}
