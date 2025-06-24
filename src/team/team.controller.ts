import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/auth.decorator';
import mongoose from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post('create')
  async createTeam(@Req() req: any, @Body() body: { characterId: string, name: string }) {
    const userId = req.user.userId;
    const isOwned = await this.teamService['characterService'].isCharacterOwnedBy(body.characterId, userId);
    if (!isOwned) {
      throw new ForbiddenException('This character does not belong to you');
    }

    const team = await this.teamService.create(body.characterId, body.name);
    if (!team) {
      throw new ForbiddenException('Unable to create team: character may already be in a team');
    }

    return team;
  }

  @Post('join')
  async joinTeam(@Req() req: any, @Body() body: { characterId: string; joinCode: number }) {
    const userId = req.user.userId;
    const isOwned = await this.teamService['characterService'].isCharacterOwnedBy(body.characterId, userId);
    if (!isOwned) {
      throw new ForbiddenException('This character does not belong to you');
    }

    const team = await this.teamService.join(body.characterId, body.joinCode);
    if (!team) {
      throw new NotFoundException('Invalid join code or character already in a team');
    }

    return team;
  }

  @Post('leave')
  async leaveTeam(@Req() req: any, @Body() body: { characterId: string }) {
    const userId = req.user.userId;
    const isOwned = await this.teamService['characterService'].isCharacterOwnedBy(body.characterId, userId);
    if (!isOwned) {
      throw new ForbiddenException('This character does not belong to you');
    }

    const success = await this.teamService.leave(body.characterId);
    if (!success) {
      throw new ForbiddenException('Unable to leave team: character may not be in a team');
    }

    return { success: true };
  }

  @Public()
  @Get()
  async getAll() {
    return this.teamService.getAll();
  }



  @Public()
  @Get('/char:charId')
  async getByCharId(@Param('charId') charId: string) {
    const team = await this.teamService.getByCharId(charId);
    if (!team) {
      throw new NotFoundException(`Team with Char ${charId} not found`);
    }
    return team;
  }

  @Public()
  @Get(':id')
  async getByIdOrJoinCode(@Param('id') id: string) {
    if (mongoose.isValidObjectId(id)) {
      const team = await this.teamService.getById(id);
      if (!team) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }
      return team;
    } else {
      if (Number.isNaN(Number(id)))
        throw new NotFoundException(`Invalid join code`);

      const team = await this.teamService.getByJoinCode(Number(id));
      if (!team) {
        throw new NotFoundException(`Team with join code ${id} not found`);
      }
      return team;
    }
  }
}
