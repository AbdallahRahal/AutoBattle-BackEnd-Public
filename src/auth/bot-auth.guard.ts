import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BotAuthGuard implements CanActivate {
    constructor() { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];

        if (!authorization || !authorization.startsWith('Bot ')) {
            throw new UnauthorizedException('Missing bot authorization header');
        }

        const apiKey = authorization.replace('Bot ', '').trim();
        const validApiKey = process.env.BOT_API_KEY;

        if (apiKey !== validApiKey) {
            throw new UnauthorizedException('Invalid bot API key');
        }

        // Marquer la request comme "authenticated as bot"
        request.bot = {
            authenticated: true,
        };

        return true;
    }
}
