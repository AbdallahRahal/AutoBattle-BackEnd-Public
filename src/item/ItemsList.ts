import { Item } from "@autobattle/common/models";

const itemList: Omit<Item, "id">[] =
    [
        {
            "name": "Attaque Simple",
            "description": "Inflige 50 dégats. 5 secondes de recharge ( Cet objet vous est attribué par défaut. Pensez à vous rendre sur le site web pour choisir votre premier objet ) ",
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
                "MaxLifePointMultiplier": 0
            },
            "class": {
                "Arcanist": 0,
                "Scout": 0,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": false,
            "spellId": 1,
            "isClassItem": false,
            "icon": "sword.png"
        },
        {
            "name": "Arcanist V : Réplique",
            "description": "Débloqué en cumulant 5 points d'Arcaniste. Réplique : toutes vos compétences ont 30% de chance de se relancer instantanément",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 5,
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
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": false,
            "spellId": 1001,
            "isClassItem": true,
            "icon": "Arcanist.png"
        },
        {
            "name": "Scout V : Anticipation",
            "description": "Débloqué en cumulant 5 points de Scout. Anticipation : vous commencer le combat 3 secondes plus tôt",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 5,
                "Dodge": 5,
                "CritChance": 5,
                "CritPower": 5,
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
                "Arcanist": 0,
                "Scout": 0,
                "Guard": 0,
                "Invoker": 0
            },
            "spellId": 1002,
            "dropable": false,
            "isClassItem": true,
            "icon": "Scout.png"
        },
        {
            "name": "Guard 5 : Résilience",
            "description": "Débloqué en cumulant 5 points de Guard. Résilience : En dessous de 20% de PV, à chaque fois que vous etes la cible d'une compétence adverse, vous récupérez 1.5% de vos PV max. Ne peux se produire que 2 fois par seconde",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 0,
                "Resistance": 5,
                "PowerMultiplier": 0,
                "HasteMultiplier": 0,
                "CritChanceMultiplier": 0,
                "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0,
                "ResistanceMultiplier": 0.03,
                "MaxLifePointMultiplier": 0.1
            },
            "class": {
                "Arcanist": 0,
                "Scout": 0,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": false,
            "spellId": 1003,
            "isClassItem": true,
            "icon": "Guard.png"
        },
        {
            "name": "Invoker 5 : Symbiose",
            "description": "Débloqué en cumulant 5 points d'Invoker. Symbiose: À chaque fois qu’une de vos invocations utilise son attaque, le temps de recharge d’un de vos sorts est réduit de 1 seconde.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 8,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 5,
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
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": false,
            "spellId": 1004,
            "isClassItem": true,
            "icon": "Invoker.png"
        },
        {
            "name": "Boule de feu",
            "description": "Inflige 30 dégâts instantanés à la cible, puis la brûle pour 14 dégâts par seconde pendant 5 secondes. 6 secondes de recharge",
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
            "isClassItem": false,
            "icon": "BouleDeFeu.png"
        },
        {
            "name": "Brise-Armure",
            "description": "Inflige 50 dégâts et réduit la résistance de la cible de 5 pendant 2 secondes (le malus de résistance est appliqué avant les dégâts). 3 secondes de recharge",
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
                "Scout": 1,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": false,
            "spellId": 2002,
            "isClassItem": false,
            "icon": "BriseArmure.png"
        },
        {
            "name": "Frappe Solide",
            "description": "Inflige 80 dégâts et augmente votre resistance de 5 pendant 4 secondes. 5 secondes de recharge",
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
            "isClassItem": false,
            "icon": "FrappeSolide.png"
        },
        {
            "name": "Invocation : Guerrier",
            "description": "Invoque un guerrier inciblable qui attaque vos ennemies. Il copie 100% de votre puissance et hâte de base. Si vous relancez le sort pendant que l’invocation est en vie, elle voit sa puissance augmenter de 5. 5 secondes de recharge.",
            "isBasic": true,
            "stats": {
                "MaxLifePoint": 0, "Haste": 0, "Dodge": 0, "CritChance": 0, "CritPower": 0, "Power": 0, "Resistance": 0,
                "PowerMultiplier": 0, "HasteMultiplier": 0, "CritChanceMultiplier": 0, "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0, "ResistanceMultiplier": 0, "MaxLifePointMultiplier": 0
            },
            "class": { "Arcanist": 0, "Scout": 0, "Guard": 0, "Invoker": 1 },
            "dropable": false,
            "spellId": 2004,
            "isClassItem": false,
            "icon": "InvocationGuerrier.png"
        },
        {
            "name": "Exécution",
            "description": "Inflige 60 dégâts et 50 supplémentaires si la cible a moins de 50% de ses PV. 4 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
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
                "Arcanist": 0,
                "Scout": 1,
                "Guard": 1,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 2,
            "isClassItem": false,
            "icon": "Execution.png"
        },
        {
            "name": "Lames-jumelles",
            "description": "Inflige 40 dégâts à 2 cible. Ce sort est toujours un coup critique. Peux toucher la même cible 2 fois. 7 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 2,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 10,
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
                "Scout": 1,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 3,
            "isClassItem": false,
            "icon": "LameJumelles.png"
        },
        {
            "name": "Toxicité",
            "description": "Chacun de vos coup critique applique un poison infligeant 15 degats par seconde pendant 3 secondes.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 10,
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
                "Scout": 2,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 4,
            "isClassItem": false,
            "icon": "Toxicite.png"
        },
        {
            "name": "Rage",
            "description": "Vos compétences ciblant des ennemies infligent 20 à 35 dégâts bonus selon vos PV manquants (max à 30%)",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 50,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 10,
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
                "Scout": 1,
                "Guard": 1,
                "Invoker": 1
            },
            "dropable": true,
            "spellId": 5,
            "isClassItem": false,
            "icon": "Rage.png"
        },
        {
            "name": "Marquage",
            "description": "Marque une cible adverse avec 5 charge durant 10 secondes. Lorsque la cible subit un coup critique une charge est consommé : vous gagnez 3% de puissance et infligé 25 dégats à la cible. 12 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 5,
                "CritPower": 10,
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
                "Arcanist": 1,
                "Scout": 1,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 8,
            "isClassItem": false,
            "icon": "Marquage.png"
        },
        {
            "name": "Châtiment Lumineux",
            "description": "Inflige 80 dégâts à une cible. Soigne l’allié avec le moins de PV de 60% des dégâts infligés. 7 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 50,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 10,
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
                "Guard": 2,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 9,
            "isClassItem": false,
            "icon": "ChatimentLumineux.png"
        },
        {
            "name": "Fracture",
            "description": "Inflige 125 dégats a une cible et reduit sa resistance de 8 pour 6 secondes. 7 secondes de recharge ",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 50,
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
                "Guard": 1,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 10,
            "isClassItem": false,
            "icon": "Fracture.png"
        },
        {
            "name": "Carré d'As",
            "description": "Inflige 10,20,30 ou 40 dégâts aléatoirement et vous soigne de 10,20,30 ou 40 PV. Si les deux tirage tombe sur 40, relance le sort immédiatement. Ne peut pas infliger de coup critique. 2.5 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 25,
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
            "isClassItem": false,
            "icon": "CarredAs.png"
        },
        {
            "name": "Réflexe",
            "description": "À chaque fois que vous esquivez, vous vous soignez de 20 points de vie et infligez instantanément 20 dégâts à un ennemi aléatoire (maximum 2 fois par seconde).",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 7,
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
                "Scout": 1,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 12,
            "isClassItem": false,
            "icon": "Reflexe.png"
        },
        {
            "name": "Danse Des Ombres",
            "description": "Chaque esquive réalisée augmente votre puissance de 6 jusqu'à la fin du combat. ",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 7,
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
                "Scout": 1,
                "Guard": 0,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 13,
            "isClassItem": false,
            "icon": "DanseDesOmbres.png"
        },
        {
            "name": "Brûlure Sacrée",
            "description": "Au début du combat, applique Brûlure Sacrée à l’ennemi le plus faible. Chaque soin (allié ou ennemi) inflige 35 dégâts à la cible de Brûlure Sacrée. Lorsque la cible meurt, Brûlure Sacrée se transfère à l'ennemi le plus faible ",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 10,
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
            "icon": "BrulureSacree.png"
        },
        {
            "name": "Impact",
            "description": "Inflige 200% de votre valeur brute de résistance en dégâts à une cible ennemie. 3 secondes de recharge.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0,
                "Haste": 0,
                "Dodge": 0,
                "CritChance": 0,
                "CritPower": 0,
                "Power": 0,
                "Resistance": 5,
                "PowerMultiplier": 0,
                "HasteMultiplier": 0,
                "CritChanceMultiplier": 0,
                "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0,
                "ResistanceMultiplier": 0.1,
                "MaxLifePointMultiplier": 0.0
            },
            "class": {
                "Arcanist": 0,
                "Scout": 0,
                "Guard": 1,
                "Invoker": 0
            },
            "dropable": true,
            "spellId": 15,
            "isClassItem": false,
            "icon": "Impact.png"
        },
        {
            "name": "Invocation : Archer",
            "description": "Invoque un archer inciblable qui attaque vos ennemies. Il copie votre puissance de base, votre chance critique de base et votre puissance critique de base. Lorsqu’il inflige un coup critique, vous gagnez 5% de chance de critique et 5 de puissance critique jusqu'a la fin du combat. Si vous relancez le sort pendant que l’invocation est en vie, elle est gagne 10 de puissance, 10% de chance critique. 6 secondes de recharge.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0, "Haste": 0, "Dodge": 0, "CritChance": 10, "CritPower": 10, "Power": 0, "Resistance": 0,
                "PowerMultiplier": 0, "HasteMultiplier": 0, "CritChanceMultiplier": 0, "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0, "ResistanceMultiplier": 0, "MaxLifePointMultiplier": 0
            },
            "class": { "Arcanist": 0, "Scout": 1, "Guard": 0, "Invoker": 1 },
            "dropable": true,
            "spellId": 16,
            "isClassItem": false,
            "icon": "InvocationArcher.png"
        },
        {
            "name": "Invocation : Golem",
            "description":
                "Invoque un golem inciblable qui intercepte 50% des dégâts reçus par votre équipe. Il copie 20% de vos PV et possède 15% de resistance. Si vous relancez le sort pendant que l’invocation est en vie, elle est soignée. Si elle est morte, vous vous soigné à la place. 10 secondes de recharge.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 50, "Haste": 0, "Dodge": 0, "CritChance": 0, "CritPower": 0, "Power": 0, "Resistance": 0,
                "PowerMultiplier": 0, "HasteMultiplier": 0, "CritChanceMultiplier": 0, "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0, "ResistanceMultiplier": 0, "MaxLifePointMultiplier": 0.05
            },
            "class": { "Arcanist": 0, "Scout": 0, "Guard": 1, "Invoker": 1 },
            "dropable": true,
            "spellId": 17,
            "isClassItem": false,
            "icon": "InvocationGolem.png"
        },
        {
            "name": "Invocation : Shaman",
            "description":
                "Invoque un shaman inciblable qui attaque et brûle vos ennemis. Il copie votre puissance de base et votre hâte de base. Si vous relancez le sort pendant que l’invocation est en vie, elle voit sa puissance augmenter de 20. 7 secondes de recharge.",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0, "Haste": 7, "Dodge": 0, "CritChance": 0, "CritPower": 0, "Power": 5, "Resistance": 0,
                "PowerMultiplier": 0, "HasteMultiplier": 0, "CritChanceMultiplier": 0, "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0, "ResistanceMultiplier": 0, "MaxLifePointMultiplier": 0
            },
            "class": { "Arcanist": 1, "Scout": 0, "Guard": 0, "Invoker": 1 },
            "dropable": true,
            "spellId": 18,
            "isClassItem": false,
            "icon": "InvocationShaman.png"
        },
        {
            "name": "Offrande",
            "description": "Vous sacrifier 10% de vos PV actuel pour forcer toutes vos invocations à relancer instantanément leurs attaques. 10 secondes de recharge",
            "isBasic": false,
            "stats": {
                "MaxLifePoint": 0, "Haste": 0, "Dodge": 0, "CritChance": 0, "CritPower": 0, "Power": 10, "Resistance": 0,
                "PowerMultiplier": 0, "HasteMultiplier": 0, "CritChanceMultiplier": 0, "CritPowerMultiplier": 0,
                "DodgeMultiplier": 0, "ResistanceMultiplier": 0, "MaxLifePointMultiplier": 0
            },
            "class": { "Arcanist": 0, "Scout": 0, "Guard": 0, "Invoker": 2 },
            "dropable": true,
            "spellId": 19,
            "isClassItem": false,
            "icon": "Offrande.png"
        },
        {
            "name": "Croissance Chaotique",
            "description": "Toutes les secondes vous gagnez aléatoirement 1% de multiplicateur de puissance, 1% de multiplicateur de chance de critique, 1% de multiplicateur de puissance critique ou 1% de multiplicateur de hâte.",
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
                "MaxLifePointMultiplier": 0
            },
            "class": {
                "Arcanist": 1,
                "Scout": 1,
                "Guard": 1,
                "Invoker": 1
            },
            "dropable": true,
            "spellId": 20,
            "isClassItem": false,
            "icon": "CroissanceChaotique.png"
        }

    ];
export default itemList