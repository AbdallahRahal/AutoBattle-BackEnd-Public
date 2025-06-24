import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CharacterEntity, CharacterDocument, CharacterEntityWithItems } from './entities/character.entity';
import mongoose, { Model, Types } from 'mongoose';
import { ItemService } from 'src/item/item.service';
import { ItemEntity } from 'src/item/entities/item.entity';
import { DateTime } from 'luxon';
import { StatAllocationPointKey, allocationPointValue, Character, ClassName, ClassRecord, Item, LEVEL_EXPERIENCE_TABLE, StatAllocationPointDistribution, StatKey, StatRecord, totalXpCaps, ClassAllocationPointDistribution } from '@autobattle/common/models';
import { mapCharacterEntityWithItemsToCommon } from './character.mapper';
import { classItemEquipRule } from 'src/item/utils/classItemRules';
import { UserService } from 'src/user/user.service';
const isDev = process.env.NODE_ENV === 'development';


@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(CharacterEntity.name) private characterModel: Model<CharacterDocument>,
    private readonly itemService: ItemService,
    private readonly userService: UserService,
  ) { }

  private isResetingScheduled = false;

  async onModuleInit() {
    await this.resetDuelLeftNumberAtHours();
  }


  async getAll(): Promise<Character[] | null> {
    const chars = await this.characterModel
      .find()
      .populate<{ items: ItemEntity[], classItems: ItemEntity[] }>('items classItems')
      .exec();

    // On traite chaque character pour peupler itemChoice manuellement
    const results: Character[] = [];

    for (const char of chars) {
      const characterWithItems = await this.createCharacterEntityWithItemsFromCharacterEntity(char.toObject())


      results.push(mapCharacterEntityWithItemsToCommon(characterWithItems));
    }

    return results;
  }
  async getCharModelById(id: string): Promise<CharacterDocument> {
    const char = await this.characterModel.findById(id).exec();
    return char
  }
  async getById(id: string): Promise<Character | null> {
    try {
      const character = await this.characterModel
        .findById(id)
        .populate<{ items: ItemEntity[], classItems: ItemEntity[] }>('items classItems')
        .exec();

      if (!character) {
        return null;
      }


      const characterWithItems = await this.createCharacterEntityWithItemsFromCharacterEntity(character.toObject())
      return mapCharacterEntityWithItemsToCommon(characterWithItems);


    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }
  async getByUserId(userId: string): Promise<Character | null> {
    try {
      const character = await this.characterModel
        .findOne({ ownerId: userId })
        .populate<{ items: ItemEntity[], classItems: ItemEntity[] }>('items classItems')
        .exec();

      if (!character) {
        return null;
      }

      const characterWithItems = await this.createCharacterEntityWithItemsFromCharacterEntity(character.toObject())
      return mapCharacterEntityWithItemsToCommon(characterWithItems);

    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async createCharacterEntityWithItemsFromCharacterEntity(character: any) {
    // Populate manual for itemChoice
    const itemChoice = await this.populateItemChoice(character.itemChoice ?? {});

    // Construction du CharacterEntityWithItems
    return {
      ...character,
      items: character.items as ItemEntity[],
      classItems: character.classItems as ItemEntity[],
      itemChoice
    };
  }

  private async populateItemChoice(itemChoice: Record<string, Types.ObjectId[]>): Promise<Record<string, ItemEntity[]>> {
    const allItemIds = Object.values(itemChoice).flat();

    if (allItemIds.length === 0) {
      return {};
    }
    const itemEntities = await this.itemService.getMultipleById(allItemIds.map((a) => a.toString()))

    const itemEntityMap = new Map<string, ItemEntity>();
    itemEntities.forEach(item => itemEntityMap.set(item._id.toString(), item));

    return Object.fromEntries(
      Object.entries(itemChoice).map(([rewardId, itemIds]) => [
        rewardId,
        itemIds
          .map(id => itemEntityMap.get(id.toString()))
          .filter(Boolean) as ItemEntity[] // Assure le typage correct
      ])
    );
  }


  async create(ownerId: string, name: string, baseDiscordServerId: string): Promise<Character> {
    const user = await this.userService.findById(ownerId)
    if (!user) {
      throw new NotFoundException(`user with ID ${ownerId} not found`);
    }
    const existingChars = await this.findAllCharByOwnerId(ownerId);
    if (existingChars.length > 0) {
      throw new ForbiddenException('Max character limit reached');
    }

    const newCharacter = new this.characterModel({
      name,
      ownerId,
      ownerDiscordId: user.discordId,
      baseDiscordServerId,
      items: []
    });

    await this.addBasicItemChoiceToChar(newCharacter);
    const character = await newCharacter.save();
    await this.recalculateComputedStats(character.id);

    return await this.getById(character.id)
  }

  async findAllCharByOwnerId(ownerId: string): Promise<Character[]> {
    const chars = await this.characterModel
      .find({ ownerId })
      .populate<{ items: ItemEntity[], classItems: ItemEntity[] }>('items classItems')
      .exec();

    // On traite chaque character pour peupler itemChoice manuellement
    const results: Character[] = [];

    for (const char of chars) {
      const characterWithItems = await this.createCharacterEntityWithItemsFromCharacterEntity(char.toObject())


      results.push(mapCharacterEntityWithItemsToCommon(characterWithItems));
    }

    return results;
  }
  async selectItemFromItemChoice(charId: string, rewardId: string, itemId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) throw new NotFoundException(`Character with ID ${charId} not found`);

    // Vérifier que la récompense existe
    const choice = character.itemChoice?.[rewardId];
    if (!choice) {
      throw new BadRequestException(`Reward ID ${rewardId} does not exist in itemChoice`);
    }

    // Vérifier que l'item fait partie de la récompense
    const isValidItem = choice.some(id => id.toString() === itemId);
    if (!isValidItem) {
      throw new BadRequestException(`Item ID ${itemId} is not part of reward ${rewardId}`);
    }

    await this.equipItem(character, itemId)


    // Supprimer la récompense de itemChoice
    delete character.itemChoice[rewardId];

    character.markModified('itemChoice');

    // Sauvegarder
    await character.save();
    await this.recalculateComputedStats(charId);

  }

  async equipItem(character: CharacterDocument, itemId: string) {
    const item = await this.itemService.getById(itemId);
    if (!item) throw new NotFoundException(`Item with ID ${itemId} not found`);
    character.items.push(new mongoose.Types.ObjectId(itemId));
  }

  private async recalculateComputedStats(characterId: string): Promise<void> {
    const character = await this.characterModel
      .findById(characterId)
      .populate<{ items: ItemEntity[] }>('items')
      .exec();

    if (!character) throw new NotFoundException(`Character with ID ${characterId} not found`);

    const computedStats: StatRecord = { ...character.baseStats };
    const computedClass: ClassRecord = { ...character.baseClass };

    // Application des items équipés
    character.items.forEach(item => {
      (Object.keys(item.stats) as StatKey[]).forEach(key => {
        computedStats[key] = (computedStats[key] || 0) + item.stats[key];
      });

      (Object.keys(item.class) as ClassName[]).forEach(key => {
        computedClass[key] = (computedClass[key] || 0) + item.class[key];
      });
    });


    // Vérification des autoEquipRules
    character.classItems = []

    for (const rule of classItemEquipRule) {
      const item = await this.itemService.getBySpellId(rule.itemSpellId);
      if (!item) continue;

      const meetsCondition = computedClass[rule.class] >= rule.minPoints;

      if (meetsCondition) {
        character.classItems.push(new mongoose.Types.ObjectId(item.id));
      }
    }

    // Application des classItems
    for (const classItem of character.classItems) {
      const item = await this.itemService.getById(classItem.toString());
      if (!item) continue;

      (Object.keys(item.stats) as StatKey[]).forEach(key => {
        computedStats[key] = (computedStats[key] || 0) + item.stats[key];
      });

      (Object.keys(item.class) as ClassName[]).forEach(key => {
        computedClass[key] = (computedClass[key] || 0) + item.class[key];
      });
    }

    // Affectation finale
    character.computedStats = computedStats;
    character.computedClass = computedClass;

    character.markModified('computedStats');
    character.markModified('computedClass');
    character.markModified('classItems');
    await character.save();
  }


  async recomputeAllCharacters(): Promise<void> {
    const characters = await this.characterModel.find().exec();
    for (const character of characters) {
      await this.recalculateComputedStats(character._id.toString());
    }
  }
  async addExperienceToChar(id: string, amount: number): Promise<void> {


    const char = await this.characterModel.findById(id).exec();
    if (!char) throw new NotFoundException('Character not found');

    // Déterminer le jour de la semaine
    const now = DateTime.now().setZone("Europe/Paris");
    const shifted = now.minus({ hours: 6 });
    const dayOfWeek = shifted.weekday % 7;

    const totalCap = totalXpCaps[dayOfWeek];

    // Calcul du restant possible jusqu'à la limite
    const xpLeft = totalCap - char.experience;

    // XP à appliquer (cappée si besoin)
    const xpToApply = Math.max(0, Math.min(amount, xpLeft));

    if (xpToApply <= 0) {
      return;
    }
    char.experience += xpToApply;


    // Gestion du passage de niveau
    let currentLevel = char.level;

    while (currentLevel + 1 < LEVEL_EXPERIENCE_TABLE.length) {
      const xpRequiredForNextLevel = LEVEL_EXPERIENCE_TABLE[currentLevel + 1];

      if (char.experience >= xpRequiredForNextLevel) {
        // Passage de niveau
        char.level = currentLevel + 1;
        currentLevel = char.level;

        char.baseStats.MaxLifePoint += Math.min(500, 50 * currentLevel)
        char.baseStats.Power += 5
        char.markModified('baseStats');

        const LEVEL_UP_EFFECTS: Record<number, (char: CharacterDocument) => Promise<void>> = {
          2: async (char) => await this.addItemChoiceToChar(char),
          3: async (char) => await this.addStatAllocationPoints(char, 2),
          4: async (char) => await this.addItemChoiceToChar(char),
          5: async (char) => await this.addStatAllocationPoints(char, 2),
          6: async (char) => await this.addReroll(char, 1),
          7: async (char) => await this.addStatAllocationPoints(char, 2),
          8: async (char) => await this.addItemChoiceToChar(char),
          9: async (char) => await this.addStatAllocationPoints(char, 2),
          10: async (char) => await this.addItemChoiceToChar(char),
          11: async (char) => await this.addStatAllocationPoints(char, 2),
          12: async (char) => await this.addReroll(char, 1),
          13: async (char) => await this.addStatAllocationPoints(char, 2),
          14: async (char) => await this.addItemChoiceToChar(char),
          15: async (char) => await this.addStatAllocationPoints(char, 3),
        };
        const effect = LEVEL_UP_EFFECTS[currentLevel];
        if (effect) {
          await effect.call(this, char);
        }
      } else {
        break;
      }
    }

    await char.save();
    await this.recalculateComputedStats(char._id.toString())
  }

  async isCharacterOwnedBy(characterId: string, ownerId: string): Promise<boolean> {
    if (!characterId || !ownerId) {
      throw new ForbiddenException('Invalid character or owner ID');
    }

    const character = await this.characterModel.findById(characterId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    return character.ownerId.toString() === ownerId;
  }

  private async resetDuelLeftNumberAtHours(): Promise<void> {
    if (this.isResetingScheduled) {
      console.warn('Reset déjà programmé, appel ignoré.');
      return;
    }

    this.isResetingScheduled = true;

    const hour = 6;
    const minute = 0;
    const now = DateTime.now().setZone('Europe/Paris');
    let nextReset = now.set({ hour, minute, second: 0, millisecond: 0 });

    if (now >= nextReset) {
      nextReset = nextReset.plus({ days: 1 });
    }

    const delay = nextReset.toMillis() - now.toMillis();
    this.printResetDelay(delay);

    setTimeout(async () => {
      await this.resetDuelLeftNumberForAllChar();
      this.isResetingScheduled = false;
      await this.resetDuelLeftNumberAtHours();
    }, delay);
  }

  private async resetDuelLeftNumberForAllChar(): Promise<void> {
    await this.characterModel.updateMany({}, { $set: { duelsLeft: 5 } });
  }

  private printResetDelay(delay: number): void {
    const hours = Math.floor(delay / (1000 * 60 * 60));
    const minutes = Math.floor((delay % (1000 * 60 * 60)) / (1000 * 60));
    console.log(`\n\n⏳ Reset des duels programmé dans ${hours}h${minutes.toString().padStart(2, '0')} ⏳\n\n`);
  }


  async updateLastTargettedDuel(charId: string): Promise<void> {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    character.lastTargettedDuel = Date.now();
    await character.save();
  }
  async decrementDuelCount(charId: string): Promise<void> {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    character.duelsLeft -= 1;
    await character.save();
  }

  async getRandomCharAroundLevel(level: number, blacklist: string[] = []): Promise<Character | null> {
    const maxRange = 20;
    const step = 2;
    let range = 2;

    while (range <= maxRange) {
      const levelMin = Math.max(level - range, 1);
      const levelMax = level + range;

      const candidates = await this.characterModel.aggregate([
        {
          $match: {
            level: { $gte: levelMin, $lte: levelMax },
            _id: { $nin: blacklist.map(id => new mongoose.Types.ObjectId(id)) }
          }
        },
        { $sample: { size: 1 } }
      ]);

      if (candidates.length > 0) {
        return this.getById(candidates[0]._id)
      }

      range += step;
    }

    return null;
  }

  async addItemChoiceToChar(character: CharacterDocument) {

    const itemChoice = await this.itemService.getMultipleRandomItem(3);
    if (!itemChoice || itemChoice.length === 0) {
      console.log('No items found to add as choice');
      return
    }
    // Génère un ID pour la récompense (utile pour lier la récompense côté client)
    const rewardId = new mongoose.Types.ObjectId().toString();
    character.itemChoice[rewardId] = itemChoice.map(item => new mongoose.Types.ObjectId(item.id));
    character.markModified('itemChoice');
  }

  async addBasicItemChoiceToChar(character: CharacterDocument) {

    const itemChoice = await this.itemService.getBasicItems();
    if (!itemChoice || itemChoice.length === 0) {
      console.log('No basic items found to add as choice');
      return
    }
    // Génère un ID pour la récompense (utile pour lier la récompense côté client)
    const rewardId = new mongoose.Types.ObjectId().toString();
    character.itemChoice[rewardId] = itemChoice.map(item => new mongoose.Types.ObjectId(item.id));
    character.markModified('itemChoice');
  }

  async addStatAllocationPoints(character: CharacterDocument, amount: number = 1) {
    try {
      character.statAllocationPoint += amount
      character.markModified('statAllocationPoint');
      //await this.NotificationGateway.notifyBot()
    } catch (error) {
      console.log('Error addStatAllocationPoints ', error)
      throw new NotFoundException(`Error addStatAllocationPoints`);
    }
  }

  async reallocateStatPoints(charId: string, newDistribution: StatAllocationPointDistribution) {

    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    for (const key in newDistribution) {
      const value = newDistribution[key as StatAllocationPointKey];
      if (value < 0 || value > 10) {
        throw new BadRequestException(
          `Invalid value for ${key}: must be between 0 and 10 (got ${value}).`
        );
      }
    }
    const oldDistribution = { ...character.statAllocationPointDistribution }

    const totalGainedPoints = character.statAllocationPoint;

    const totalRequestedPoints = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);

    if (totalRequestedPoints > totalGainedPoints) {
      throw new BadRequestException(`You can’t allocate more than ${totalGainedPoints} points in total.`);
    }

    // Retirer les anciens bonus
    for (const key in oldDistribution) {
      const oldAmount = oldDistribution[key as StatAllocationPointKey];
      const statKey = key.replace('AllocationPoint', '') as StatKey;
      character.baseStats[statKey] -= allocationPointValue[statKey] * oldAmount;
    }

    // Appliquer les nouveaux bonus
    for (const key in newDistribution) {
      const amount = newDistribution[key as StatAllocationPointKey];
      const statKey = key.replace('AllocationPoint', '') as StatKey;
      character.baseStats[statKey] += allocationPointValue[statKey] * amount;
    }

    // Mise à jour de la répartition
    character.statAllocationPointDistribution = newDistribution;
    character.markModified('baseStats');

    await character.save();
    await this.recalculateComputedStats(charId);
  }

  async addClassAllocationPoints(character: CharacterDocument, amount: number = 1) {
    try {
      character.classAllocationPoint += amount
      character.markModified('statAllocationPoint');
      //await this.NotificationGateway.notifyBot()
    } catch (error) {
      console.log('Error addStatAllocationPoints ', error)
      throw new NotFoundException(`Error addStatAllocationPoints`);
    }
  }

  async reallocateClassPoints(charId: string, newDistribution: ClassAllocationPointDistribution) {

    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    for (const key in newDistribution) {
      const value = newDistribution[key as ClassName];
      if (value < 0) {
        throw new BadRequestException(
          `Invalid value for ${key}: must be greater than 5 (got ${value}).`
        );
      }
    }

    const oldDistribution = { ...character.classAllocationPointDistribution }

    const totalGainedPoints = character.classAllocationPoint;

    const totalRequestedPoints = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);

    if (totalRequestedPoints > totalGainedPoints) {
      throw new BadRequestException(`You can’t allocate more than ${totalGainedPoints} points in total.`);
    }

    // Retirer les anciens bonus
    for (const key in oldDistribution) {
      const oldAmount = oldDistribution[key as ClassName];

      character.baseClass[key] -= oldAmount;
    }

    // Appliquer les nouveaux bonus
    for (const key in newDistribution) {
      const amount = newDistribution[key as ClassName];

      character.baseClass[key] += amount;
    }


    // Mise à jour de la répartition
    character.classAllocationPointDistribution = newDistribution;
    character.markModified('baseClass');

    await character.save();
    await this.recalculateComputedStats(charId);
  }


  async incrementProcDuelCount(charId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }
    character.procDuelCount++
    await character.save();
  }

  async incrementProcDuelWin(charId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }
    character.procDuelWin++
    await character.save();
  }

  async incrementDailyDuelCount(charId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }
    character.dailyDuelCount++
    await character.save();
  }

  async incrementDailyDuelWin(charId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }
    character.dailyDuelWin++
    await character.save();
  }

  async addReroll(character: CharacterDocument, amount: number = 1) {
    try {
      character.itemReroll += amount
      character.markModified('itemReroll');
      //await this.NotificationGateway.notifyBot()
    } catch (error) {
      console.log('Error addReroll ', error)
      throw new NotFoundException(`Error addReroll`);
    }
  }

  async rerollItem(charId: string, itemId: string) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) throw new NotFoundException(`Character with ID ${charId} not found`);

    const index = character.items.findIndex((i) => i.toString() === itemId);
    if (index === -1) throw new NotFoundException(`Item with ID ${itemId} not found`);

    character.items.splice(index, 1);

    character.itemReroll--;

    await this.addItemChoiceToChar(character);

    await character.save();
    await this.recalculateComputedStats(charId)

  }

  async addRaidReward(charId: string, raidLevel: number) {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      return
    }

    const LEVEL_UP_EFFECTS: Record<number, (char: CharacterDocument) => Promise<void>> = {
      1: async (char) => await this.addStatAllocationPoints(char, 3),
      2: async (char) => await this.addStatAllocationPoints(char, 3),
      3: async (char) => await this.addReroll(char, 1),
      4: async (char) => await this.addClassAllocationPoints(char, 1),
      5: async (char) => {
        await this.addClassAllocationPoints(char, 1)
        await this.addStatAllocationPoints(char, 4)
      },
    };

    const effect = LEVEL_UP_EFFECTS[raidLevel];
    if (effect) {
      await effect.call(this, character);
    }


    await character.save()
  }


  async setTeamId(charId: string, teamId: string): Promise<void> {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    character.teamId = teamId;
    await character.save();
  }
  async clearTeamId(charId: string): Promise<void> {
    const character = await this.characterModel.findById(charId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${charId} not found`);
    }

    character.teamId = null;
    await character.save();
  }


  async setCharacterModel(characterId: string, requestedModel: string): Promise<void> {
    const character = await this.characterModel.findById(characterId).exec();
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    const userModels = await this.userService.getUserModel(character.ownerId.toString());
    if (!userModels.includes(requestedModel)) {
      throw new ForbiddenException(`User does not own the requested model: ${requestedModel}`);
    }

    character.modelName = requestedModel;
    await character.save();
  }
}