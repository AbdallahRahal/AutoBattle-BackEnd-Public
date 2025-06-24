import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './auth.decorator';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Get('discord/redirect')
    @UseGuards(AuthGuard('discord'))
    async discordCallback(@Req() req: Request, @Res() res: Response) {
        const user = req.user;
        const token = await this.authService.generateJwt(user);

        // Définir la target frontend en fonction de l'environnement
        const frontendUrl =
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:5173'
                : process.env.FRONTEND_URL;

        res.redirect(`${frontendUrl}/auth?token=${token}`);
    }

    @Public()
    @Get('discord')
    @UseGuards(AuthGuard('discord'))
    async discordLogin() {
        // Passport va gérer la redirection automatiquement
    }

    @Get('user')
    async getUser(@Req() req: Request) {
        return req.user;
    }


    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        // Comme tu es en JWT → il suffit au front de supprimer le token
        // Ici → tu peux juste confirmer
        return res.json({ message: 'JWT => need to delete JWT in front' });
    }
}
