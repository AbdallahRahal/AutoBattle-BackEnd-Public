import { ClassName } from "@autobattle/common/models";

export interface ClassItemEquipRule {
    class: ClassName;
    minPoints: number;
    itemSpellId: number; // ✅ plutôt que itemId
}

export const classItemEquipRule: ClassItemEquipRule[] = [
    {
        class: ClassName.Arcanist,
        minPoints: 5,
        itemSpellId: 1001,
    },
    {
        class: ClassName.Scout,
        minPoints: 5,
        itemSpellId: 1002,
    },
    {
        class: ClassName.Guard,
        minPoints: 5,
        itemSpellId: 1003,
    },
    {
        class: ClassName.Invoker,
        minPoints: 5,
        itemSpellId: 1004,
    }
];
