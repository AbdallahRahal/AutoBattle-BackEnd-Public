import { Controller, Get, Patch, Body, Param, Req, UseGuards, NotFoundException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get('')
    async getUser(@Req() req: any) {
        const userId = req.user.userId;
        const user = await this.userService.findById(userId)
        return user
    }

    @Get('model')
    async getUserModel(@Req() req: any) {
        const userId = req.user.userId;
        const modelList = await this.userService.getUserModel(userId)
        return modelList
    }
    @Get('unlockRandomModel')
    async unlockRandomModel(@Req() req: any) {
        const userId = req.user.userId;
        const unlockedModel = await this.userService.unlockRandomModel(userId)
        return { unlockedModel: unlockedModel }
    }

}
