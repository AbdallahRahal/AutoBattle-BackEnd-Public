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
    "id": "BOSS_4_FireBall",
    isClassItem: false
}
const brulureItem = {
    "name": "Brûlure Sacrée",
    "description": "Au début du combat, applique Brûlure Sacrée à l’ennemi le plus faible. Chaque soin (allié ou ennemi) inflige 30 dégâts à la cible de Brûlure Sacrée (max 2 fois/s). Lorsque la cible meurt, Brûlure Sacrée se transfère à l'ennemi le plus faible ",
    "isBasic": false,
    "stats": {
        "MaxLifePoint": 0,
        "Haste": 0,
        "Dodge": 0,
        "CritChance": 0,
        "CritPower": 0,
        "Power": 20,
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
    "dropable": true,
    "spellId": 14,
    "isClassItem": false,
    "icon": "BrulureSacree.png",
    "id": "BOSS_4_Brulure",

}
const chatimentSpell: Item = {
    "id": "BOSS_4_Chatimeent",

    "name": "Châtiment Lumineux",
    "description": "Inflige 80 dégâts à une cible. Soigne l’allié avec le moins de PV de 70% des dégâts infligés. 7 secondes de recharge",
    "isBasic": false,
    "stats": {
        "MaxLifePoint": 50,
        "Haste": 0,
        "Dodge": 0,
        "CritChance": 0,
        "CritPower": 0,
        "Power": 10,
        "Resistance": 2,
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
        "Guard": 2,
        "Invoker": 0
    },
    "dropable": true,
    "spellId": 9,
    "icon": "ChatimentLumineux.png",
    isClassItem: false
}

const carre: Item = {
    "id": "BOSS_4_Carre",
    "name": "Carré d'As",
    "description": "Inflige 10,20,30 ou 40 dégâts aléatoirement et vous soigne de 10,20,30 ou 40 PV. Si les deux tirage tombe sur 40, relance le sort immédiatement. Ne peut pas infliger de coup critique. 2 secondes de recharge",
    "isBasic": false,
    "stats": {
        "MaxLifePoint": 50,
        "Haste": 0,
        "Dodge": 0,
        "CritChance": 0,
        "CritPower": 0,
        "Power": 5,
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
        "Arcanist": 2,
        "Scout": 0,
        "Guard": 0,
        "Invoker": 0
    },
    "dropable": true,
    "spellId": 11,
    "icon": "CarredAs.png",
    isClassItem: false

}

const baseStats: StatRecord = {
    MaxLifePoint: 16000,
    Haste: 0,
    Dodge: 10,
    CritChance: 0,
    CritPower: 0,
    Power: 80,
    Resistance: 10,
    PowerMultiplier: 0,
    HasteMultiplier: 0,
    CritChanceMultiplier: 0,
    CritPowerMultiplier: 0,
    DodgeMultiplier: 0,
    ResistanceMultiplier: 0,
    MaxLifePointMultiplier: 0
}

export const BOSS_4_Team: FightTeam =
{
    teamId: 'BOSS_4',
    members: [
        {
            id: "BOSS_4_0",
            ownerId: null,
            ownerDiscordId: null,
            baseDiscordServerId: null,
            name: "BOSS_4_0",
            level: 1,
            experience: 0,
            baseStats: baseStats,
            baseClass: {
                [ClassName.Arcanist]: 0,
                [ClassName.Scout]: 0,
                [ClassName.Guard]: 0,
                [ClassName.Invoker]: 0
            },
            computedStats: { ...baseStats, MaxLifePointMultiplier: 0.1 },
            computedClass: {
                [ClassName.Arcanist]: 0,
                [ClassName.Scout]: 0,
                [ClassName.Guard]: 0,
                [ClassName.Invoker]: 0
            },
            items: [{ ...fireballItem }, { ...fireballItem }, { ...brulureItem }],
            itemChoice: undefined,
            modelName: "BOSS_4_0",
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
        }, {
            id: "BOSS_4_1",
            ownerId: null,
            ownerDiscordId: null,
            baseDiscordServerId: null,
            name: "BOSS_4_1",
            level: 1,
            experience: 0,
            baseStats: baseStats,
            baseClass: {
                [ClassName.Arcanist]: 0,
                [ClassName.Scout]: 0,
                [ClassName.Guard]: 0,
                [ClassName.Invoker]: 0
            },
            computedStats: { ...baseStats, PowerMultiplier: 0.15 },
            computedClass: {
                [ClassName.Arcanist]: 0,
                [ClassName.Scout]: 0,
                [ClassName.Guard]: 0,
                [ClassName.Invoker]: 0
            },
            items: [{ ...fireballItem }, { ...chatimentSpell }, { ...brulureItem }],
            itemChoice: undefined,
            modelName: "BOSS_4_1",
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
        }, {
            id: "BOSS_4_2",
            ownerId: null,
            ownerDiscordId: null,
            baseDiscordServerId: null,
            name: "BOSS_4_2",
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
            items: [{ ...carre }, { ...carre }],
            itemChoice: undefined,
            modelName: "BOSS_4_2",
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