import { Character, ClassName } from '@autobattle/common/models';
import { CharacterEntity, CharacterEntityWithItems } from './entities/character.entity';
import { mapItemEntityToCommon } from 'src/item/item.mapper';


export function mapCharacterEntityWithItemsToCommon(entity: CharacterEntityWithItems): Character {
    return {
        id: entity._id.toString(),
        ownerId: entity.ownerId.toString(),
        ownerDiscordId: entity.ownerDiscordId,
        baseDiscordServerId: entity.baseDiscordServerId,
        name: entity.name,

        level: entity.level,
        experience: entity.experience,

        baseStats: entity.baseStats,
        baseClass: entity.baseClass,

        computedStats: entity.computedStats,
        computedClass: entity.computedClass,

        modelName: entity.modelName,
        duelsLeft: entity.duelsLeft,

        items: [...entity.items.map(mapItemEntityToCommon), ...entity.classItems.map(mapItemEntityToCommon)],
        itemChoice: Object.fromEntries(
            Object.entries(entity.itemChoice ?? {}).map(([rewardId, items]) => [
                rewardId,
                items.map(mapItemEntityToCommon)
            ])
        ),

        statAllocationPoint: entity.statAllocationPoint,
        statAllocationPointDistribution: entity.statAllocationPointDistribution,
        classAllocationPoint: entity.classAllocationPoint,
        classAllocationPointDistribution: entity.classAllocationPointDistribution,

        procDuelCount: entity.procDuelCount,
        procDuelWin: entity.procDuelWin,
        dailyDuelCount: entity.dailyDuelCount,
        dailyDuelWin: entity.dailyDuelWin,

        itemReroll: entity.itemReroll,

        figherType: entity.figherType,
        teamId: entity.teamId,
        lastTargettedDuel: entity.lastTargettedDuel
    };
}
