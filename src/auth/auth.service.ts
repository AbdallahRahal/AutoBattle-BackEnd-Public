
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async generateJwt(user: any) {
        const payload = { email: user.email, sub: user.id, username: user.username };

        return this.jwtService.sign(payload);
    }

    async findOrCreateDiscordUser(discordProfile: {
        discordId: string;
        username: string;
        email: string;
    }) {
        let user = await this.userService.findByDiscordId(discordProfile.discordId);

        if (!user) {
            user = await this.userService.create({
                discordId: discordProfile.discordId,
                username: discordProfile.username,
                email: discordProfile.email,
            });
        }

        return user;
    }
}
