import { Character, ClassName, FightTeam, Item, StatRecord } from "@autobattle/common/models";
const FrappeSolide: Item = {
    "name": "Frappe Solide",
    "description": "Inflige 70 dégâts et augmente votre resistance de 10 pendant 4 secondes. 5 secondes de recharge",
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
        "Arcanist": 0,
        "Scout": 0,
        "Guard": 1,
        "Invoker": 0
    },
    "dropable": false,
    "spellId": 2003,
    "icon": "FrappeSolide.png",
    id: "1",
    isClassItem: false
}
const Impact: Item = {
    "name": "Impact",
    "description": "Inflige 250% de votre valeur brute de résistance en dégâts à une cible ennemie. En contrepartie, vous perdez 1.5% de vos points de vie actuels. 3 seconde de recharge.",
    "isBasic": false,
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
        "MaxLifePointMultiplier": 0.0
    },
    "class": {
        "Arcanist": 0,
        "Scout": 0,
        "Guard": 0,
        "Invoker": 0
    },
    "dropable": true,
    "spellId": 15,
    "icon": "Impact.png",
    id: "2",
    isClassItem: false
}
const baseStats: StatRecord = {
    MaxLifePoint: 11000,
    Haste: 10,
    Dodge: 0,
    CritChance: 10,
    CritPower: 10,
    Power: 30,
    Resistance: 15,
    PowerMultiplier: 0,
    HasteMultiplier: 0,
    CritChanceMultiplier: 0,
    CritPowerMultiplier: 0,
    DodgeMultiplier: 0,
    ResistanceMultiplier: 0,
    MaxLifePointMultiplier: 0
}

export const BOSS_2_Team: FightTeam = {
    teamId: 'BOSS_2',
    members: [{
        id: "BOSS_2",
        ownerId: null,
        ownerDiscordId: null,
        baseDiscordServerId: null,
        name: "BOSS_2",
        level: 2,
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
        items: [{ ...FrappeSolide }, { ...FrappeSolide }, { ...Impact }],
        itemChoice: undefined,
        modelName: "BOSS_2",
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