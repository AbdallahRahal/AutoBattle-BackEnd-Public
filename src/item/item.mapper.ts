import { Item } from "@autobattle/common/models";
import { ItemEntity } from "./entities/item.entity";

export function mapItemEntityToCommon(entity: ItemEntity): Item {
    return {
        id: entity._id.toString(),
        name: entity.name,
        description: entity.description,
        icon: entity.icon,
        stats: entity.stats,

        isBasic: entity.isBasic,
        dropable: entity.dropable,
        isClassItem: entity.isClassItem,
        class: entity.class,
        spellId: entity.spellId,
    };
}