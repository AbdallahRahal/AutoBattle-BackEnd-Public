import { Character, ClassName, FightTeam, Item, StatRecord } from "@autobattle/common/models";
const fireballItem: Item = {
    "name": "Boule de feu",
    "description": "Inflige 25 dégâts instantanés à la cible, puis la brûle pour 15 dégâts par seconde pendant 5 secondes. 6 secondes de recharge",
    "isBasic": true,
    "stats": {
        "MaxLifePoint": 0,
        "Haste": 0,
        "Dodge": 0,
        "CritChance": 0,
        "CritPower": 0,
        "Power": 0,
        "Resistance": 0,
        "PowerMultiplier": 0,
        "HasteMultiplier": 0,
        "CritChanceMultiplier": 0,
        "CritPowerMultiplier": 0,
        "DodgeMultiplier": 0,
        "ResistanceMultiplier": 0,
        "MaxLifePointMultiplier": 0
    },
    "class": {
        "Arcanist": 1,
        "Scout": 0,
        "Guard": 0,
        "Invoker": 0
    },
    "dropable": false,
    "spellId": 2001,
    "icon": "BouleDeFeu.png",
    "id": "BOSS_1_FireBall",
    isClassItem: false
}
const baseStats: StatRecord = {
    MaxLifePoint: 3900,
    Haste: 20,
    Dodge: 10,
    CritChance: 10,
    CritPower: 0,
    Power: 10,
    Resistance: 20,
    PowerMultiplier: 0,
    HasteMultiplier: 0,
    CritChanceMultiplier: 0,
    CritPowerMultiplier: 0,
    DodgeMultiplier: 0,
    ResistanceMultiplier: 0,
    MaxLifePointMultiplier: 0
}

export const BOSS_1_Team: FightTeam =
{
    teamId: 'BOSS_1',
    members: [{
        id: "BOSS_1",
        ownerId: null,
        ownerDiscordId: null,
        baseDiscordServerId: null,
        name: "BOSS_1",
        level: 1,
        experience: 0,
        baseStats: baseStats,
        baseClass: {
            [ClassName.Arcanist]: 0,
            [ClassName.Scout]: 0,
            [ClassName.Guard]: 0,
            [ClassName.Invoker]: 0
        },
        computedStats: baseStats,
        computedClass: {
            [ClassName.Arcanist]: 0,
            [ClassName.Scout]: 0,
            [ClassName.Guard]: 0,
            [ClassName.Invoker]: 0
        },
        items: [{ ...fireballItem }, { ...fireballItem }],
        itemChoice: undefined,
        modelName: "BOSS_1",
        duelsLeft: 0,
        statAllocationPoint: 0,
        statAllocationPointDistribution: undefined,
        classAllocationPoint: 0,
        classAllocationPointDistribution: undefined,
        procDuelCount: 0,
        procDuelWin: 0,
        dailyDuelCount: 0,
        dailyDuelWin: 0,
        itemReroll: 0,
        figherType: "Boss",
        teamId: null,
        lastTargettedDuel: 0
    }]
}