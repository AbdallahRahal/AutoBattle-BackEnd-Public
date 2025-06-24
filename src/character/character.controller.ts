import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, ForbiddenException, ConflictException, BadRequestException, Put, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { Character, ClassAllocationPointDistribution, StatAllocationPointDistribution } from '@autobattle/common/models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/auth.decorator';
import characterModelName from 'src/utils/modelName';

@UseGuards(JwtAuthGuard)
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Public()
  @Get('/model')
  async getModelName(): Promise<string[]> {
    return characterModelName
  }

  @Post('/model')
  async setCharacterModel(@Req() req: any, @Body() data: { characterId: string, modelName: string, }): Promise<boolean> {
    const userId = req.user.userId;

    const isOwnedByUser = await this.characterService.isCharacterOwnedBy(data.characterId, userId);
    if (!isOwnedByUser) {
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);
    }

    await this.characterService.setCharacterModel(data.characterId, data.modelName)
    return true

  }

  @Post()
  async create(@Req() req: any, @Body() createCharacterDto: { name: string, baseDiscordServerId: string }): Promise<Character> {
    const userId = req.user.userId;

    const char = await this.characterService.create(userId, createCharacterDto.name, createCharacterDto.baseDiscordServerId);

    return char
  }

  @Public()
  @Get('')
  async getAllCharaters(): Promise<Character[]> {
    return await this.characterService.getAll()
  }

  @Get('all')
  async getAllOwnerCharaters(@Req() req: any): Promise<Character[]> {
    const userId = req.user.userId;
    const characters = await this.characterService.findAllCharByOwnerId(userId)
    if (!characters) {
      throw new NotFoundException(`No char found for owner id ${userId} `);
    }
    return characters
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Character> {
    const character = await this.characterService.getById(id);
    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character
  }

  @Post('recompute/verfefrojio3R43R54')
  async recomputeAllCharacters(): Promise<{ success: true }> {
    await this.characterService.recomputeAllCharacters();
    return { success: true };
  }


  @Post('claimItem')
  async selectItemFromItemChoice(@Req() req: any, @Body() data: { charId: string, rewardId: string, itemId: string }) {
    const userId = req.user.userId;
    const isOwnedByUser = await this.characterService.isCharacterOwnedBy(data.charId, userId);
    if (!isOwnedByUser) {
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);
    }
    await this.characterService.selectItemFromItemChoice(data.charId, data.rewardId, data.itemId);

    return { success: true };

  }

  @Put('statPoint')
  async reallocateStatPoints(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const charId = body.characterId;
    const newDistribution: StatAllocationPointDistribution = body.newDistribution;

    // Vérifier si le personnage appartient à l'utilisateur
    const isOwnedByUser = await this.characterService.isCharacterOwnedBy(charId, userId);
    if (!isOwnedByUser) {
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);
    }
    await this.characterService.reallocateStatPoints(charId, newDistribution)

    return true
  }

  @Put('classPoint')
  async reallocateClassPoints(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const charId = body.characterId;
    const newDistribution: ClassAllocationPointDistribution = body.newDistribution;

    // Vérifier si le personnage appartient à l'utilisateur
    const isOwnedByUser = await this.characterService.isCharacterOwnedBy(charId, userId);
    if (!isOwnedByUser) {
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);
    }
    await this.characterService.reallocateClassPoints(charId, newDistribution)

    return true
  }

  @Post('reroll')
  async rerollItem(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const charId = body.characterId;
    const itemId = body.itemId;

    // Vérifier si le personnage appartient à l'utilisateur
    const isOwnedByUser = await this.characterService.isCharacterOwnedBy(charId, userId);
    if (!isOwnedByUser) {
      throw new ForbiddenException(`Character does not belong to owner with ID ${userId}`);
    }
    await this.characterService.rerollItem(charId, itemId)

    return true
  }

  @Post('xp/FER0VKEJRV/:number')
  async addXpToAllChar(
    @Param('number') number: string
  ) {

    const allchar = await this.characterService.getAll()
    allchar.forEach(char => {
      this.characterService.addExperienceToChar(char.id, Number(number))
    });

    return true
  }

  @Post('loot/FER0VKEJRV/:charid')
  async addLootToChar(@Param('charid') charid: string) {

    const char = await this.characterService.getCharModelById(charid)

    await this.characterService.addItemChoiceToChar(char)
    await char.save()

    return true
  }


}