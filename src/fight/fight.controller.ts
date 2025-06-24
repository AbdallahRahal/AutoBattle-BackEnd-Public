import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Req, ForbiddenException, Query, InternalServerErrorException, Inject, ParseIntPipe, ConflictException, forwardRef, UseGuards } from '@nestjs/common';
import { FightService } from './fight.service';
import { CreateFightDto } from './dto/create-fight.dto';
import { UpdateFightDto } from './dto/update-fight.dto';
import { CharacterService } from 'src/character/character.service';
import { Public } from 'src/auth/auth.decorator';
import { EndFightDto } from './dto/end-fight.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Fight } from '@autobattle/common/models';
import { NotificationGateway } from 'src/notificationSocket/notificationSocket.gateway';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as pako from 'pako';


@UseGuards(JwtAuthGuard)
@Controller('fight')
export class FightController {
  constructor(private readonly fightService: FightService,
    private readonly characterService: CharacterService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly NotificationGateway: NotificationGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  @Public()
  @Get('/:id')
  async getFightById(@Param('id') id: string) {
    const fight = await this.fightService.getFightById(id);
    if (!fight) {
      throw new NotFoundException(`Fight not found`);
    }
    return fight;
  }

  @Public()
  @Get('/token/:fightToken')
  async getFightByFightToken(@Param('fightToken') fightToken: string): Promise<Fight> {
    const fight = await this.fightService.getFightByFightToken(fightToken)
    if (!fight) {
      console.error('WANTED TO GET FIGHT BUT NOT FOUND BY TOKEN')
      throw new NotFoundException(`Fight not found`);
    }
    return fight
  }

  @Public()
  @Patch('/token/:fightToken')
  async patchFight(
    @Param('fightToken') fightToken: string,
    @Body() patchFightDto: UpdateFightDto
  ) {
    const fight = await this.fightService.getFightByFightToken(fightToken)
    if (!fight) {
      console.error('WANTED TO UPDATE FIGHT BUT NOT FOUND BY TOKEN')
      throw new NotFoundException(`Fight not found`);
    }

    if (patchFightDto.status == 'ACTIVE') {
      await this.fightService.handleFightStarted(fight)
    }
    return 'success'
  }


  @Public()
  @Patch('/token/:fightToken/end')
  async endFight(
    @Param('fightToken') fightToken: string,
    @Body() body: any
  ): Promise<void> {
    const fight = await this.fightService.getFightByFightToken(fightToken);
    if (!fight) {
      console.error('WANTED TO END FIGHT BUT NOT FOUND BY TOKEN');
      throw new NotFoundException(`Fight not found`);
    }

    let endFightData: any;

    if (body.compressed) {
      const compressedBuffer = Buffer.from(body.payload, 'base64');
      const decompressed = pako.inflate(compressedBuffer, { to: 'string' });
      endFightData = JSON.parse(decompressed);
    } else {
      endFightData = body;
    }

    try {
      await this.fightService.handleFightEnded(fight.id, endFightData);
    } catch (error) {
      console.log('Error on trying to end fight : ', error);
    }
  }


  @Post('/duel')
  async createDailyDuel(
    @Body('characterId') charId: string,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    if (!(await this.characterService.isCharacterOwnedBy(charId, userId)))
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);

    try {
      const createFightResult = await this.fightService.createDailyDuel(charId)
      return createFightResult;
    } catch (error) {
      console.log('Error : ', error)
      throw new InternalServerErrorException('Failed to create duel fight');
    }
  }
  @Post('/duelvs')
  async createTargettedDuel(
    @Body('characterId') charId: string,
    @Body('targetId') targetId: string,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    if (!(await this.characterService.isCharacterOwnedBy(charId, userId)))
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);

    try {
      const createFightResult = await this.fightService.createTargettedDuel(charId, targetId)
      return createFightResult;
    } catch (error) {
      console.log('Error : ', error)
      throw new InternalServerErrorException('Failed to create duel fight');
    }
  }

  @Get('/duel/all')
  async getAllDuelsByUser(
    @Req() req: any
  ) {
    const userId = req.user.userId;

    return await this.fightService.getAllDuelByUserId(userId)
  }

  @Get('/duel/current')
  async getCurrentDuelFightByUser(
    @Req() req: any
  ) {
    const userId = req.user.userId;
    const charId = (await this.characterService.findAllCharByOwnerId(userId))[0]?.id
    return await this.fightService.getCurrentDuelFightByCharId(charId);
  }

  @Get('/duel/historic')
  async getDuelHistoricByUser(
    @Req() req: any
  ) {
    const userId = req.user.userId;
    const charId = (await this.characterService.findAllCharByOwnerId(userId))[0]?.id
    return await this.fightService.getDuelHistoricByCharId(charId)
  }

  @Public()
  @Get('/duel/all/:charId')
  async getAllDuelsByCharId(
    @Param('charId') charId: string,
  ) {
    return await this.fightService.getAllDuelByCharId(charId)
  }

  @Public()
  @Get('/duel/current/:charId')
  async getCurrentDuelFightByCharId(
    @Param('charId') charId: string,
  ) {
    return await this.fightService.getCurrentDuelFightByCharId(charId);
  }

  @Get('/duel/historic/:charId')
  async getDuelHistoricByCharId(@Param('charId') charId: string,
  ) {
    return await this.fightService.getDuelHistoricByCharId(charId)
  }

}
