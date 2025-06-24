import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(private readonly authService: AuthService) {
        const isDev = process.env.NODE_ENV === 'development';
        super({
            clientID: isDev
                ? process.env.DISCORD_CLIENT_ID_DEV
                : process.env.DISCORD_CLIENT_ID,
            clientSecret: isDev
                ? process.env.DISCORD_CLIENT_SECRET_DEV
                : process.env.DISCORD_CLIENT_SECRET,
            callbackURL: isDev
                ? process.env.DISCORD_CALLBACK_URL_DEV
                : process.env.DISCORD_CALLBACK_URL,
            scope: ['identify', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const { id, username, email } = profile;

        // Créer ou récupérer le user
        const user = await this.authService.findOrCreateDiscordUser({
            discordId: id,
            username,
            email,
        });

        return user;
    }
}
