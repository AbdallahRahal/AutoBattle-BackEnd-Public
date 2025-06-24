import { Controller, Get, Post, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotAuthGuard } from 'src/auth/bot-auth.guard';
import { CharacterService } from 'src/character/character.service';
import { FightService } from 'src/fight/fight.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { NotFoundError } from 'rxjs';

@UseGuards(BotAuthGuard)
@Controller('bot')
export class BotController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly fightService: FightService,
    private readonly characterService: CharacterService,
  ) { }

  @Post('character/create')
  async createCharacter(
    @Body() body: {
      discordId: string;
      username: string,
      email: string,
      name: string,
      baseDiscordServerId: string
    },
  ) {
    const { discordId, name, username, email, baseDiscordServerId } = body;

    const user = await this.authService.findOrCreateDiscordUser({
      discordId,
      username,
      email
    })
    const character = await this.characterService.create(user.id.toString(), name, baseDiscordServerId);
    return character
  }

  @Get('character/:discordId')
  async getCharacter(@Param('discordId') discordId: string) {
    const user = await this.userService.findByDiscordId(discordId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const character = await this.characterService.getByUserId(user.id.toString());
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    return character
  }

  @Post('stopTag/:userId')
  async stopTagUserOnMessage(@Param('userId') userId: string) {
    await this.userService.toggleTagUserOnMessage(userId, false)
    return true
  }

  @Post('startTag/:userId')
  async startTagUserOnMessage(@Param('userId') userId: string) {
    await this.userService.toggleTagUserOnMessage(userId, true)
    return true
  }

  @Get('stopTagUser')
  async getAllStopTagDiscordId() {
    return await this.userService.getAllStopTagDiscordId()
  }


  @Post('fight/daily/:discordUserId/:discordServerId')
  async launchDailyFight(
    @Param('discordUserId') discordUserId: string,
    @Param('discordServerId') discordServerId: string
  ) {
    const user = await this.userService.findByDiscordId(discordUserId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const character = await this.characterService.getByUserId(user.id.toString());
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    const fight = await this.fightService.createDailyDuel(character.id, discordServerId);
    return fight
  }


  @Post('fight/targetted')
  async launchTargettedFight(
    @Body('discordUserId') discordUserId: string,
    @Body('discordTargetId') discordTargetId: string,
    @Body('discordServerId') discordServerId: string
  ) {
    const user = await this.userService.findByDiscordId(discordUserId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const userCharacter = await this.characterService.getByUserId(user.id.toString());
    if (!userCharacter) {
      throw new NotFoundException('Character not found')
    }

    const target = await this.userService.findByDiscordId(discordTargetId)
    if (!target) {
      throw new NotFoundException('User not found')
    }
    const targetCharacter = await this.characterService.getByUserId(target.id.toString());
    if (!targetCharacter) {
      throw new NotFoundException('Character not found')
    }

    const fight = await this.fightService.createTargettedDuel(userCharacter.id, targetCharacter.id, discordServerId);
    return fight
  }

  @Post('fight/groupedUserForFight')
  async launchProcFight(
    @Body() body: { groupedDiscordUser: Record<string, string[]> },
  ) {
    const { groupedDiscordUser } = body;

    await this.fightService.createProcFight(groupedDiscordUser)

    return true
  }
}
