import { ConflictException, ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FightEntity } from './entities/fight.entity';
import { NotificationGateway } from 'src/notificationSocket/notificationSocket.gateway';
import generateRandomToken from 'src/utils/randomToken';
import { DockerManager } from 'src/utils/dockerManager';
import { EndFightDto } from './dto/end-fight.dto';
import { DamageMeter } from './entities/damageMeter.entity';
import { CharacterService } from 'src/character/character.service';
import { ItemService } from 'src/item/item.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { DateTime } from 'luxon';
import { mapFightEntityToCommon } from './fight.mapper';
import { Character, Fight, FightTeam } from '@autobattle/common/models';
import { CharacterDocument } from 'src/character/entities/character.entity';
import { TournamentService } from 'src/tournament/tournament.service';

type GenerateMatchupsOptions = {
  preferSmall?: boolean; // Préférer les petits matchs (1v1, 1v2)
  preferSmallRatio?: number; // % de chance de préférer le petit format
  forceEveryone?: boolean; // Forcer la participation de tout le monde
};
type Matchup = [Character[], Character[]];
const isDev = process.env.NODE_ENV === 'development';

@Injectable()
export class FightService {
  constructor(
    @InjectModel(FightEntity.name) private fightModel: Model<FightEntity>,
    @InjectModel(DamageMeter.name) private damageMeterModel: Model<DamageMeter>,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly NotificationGateway: NotificationGateway,

    @Inject(forwardRef(() => TournamentService))
    private readonly tournamentService: TournamentService,

    @Inject(forwardRef(() => CharacterService))
    private readonly characterService: CharacterService,

    private readonly itemService: ItemService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  duelLocks = new Set<string>();

  DuelLockManager = {
    isLocked: (charId: string) => this.duelLocks.has(charId),
    lock: (charId: string) => this.duelLocks.add(charId),
    unlock: (charId: string) => this.duelLocks.delete(charId)
  };

  async getFightByFightToken(fightToken: string): Promise<Fight> {
    try {
      return mapFightEntityToCommon((await this.fightModel.findOne({ fightToken }).exec()).toObject());
    } catch (error) {
      return null
    }
  }

  async getFightById(id: string): Promise<Fight> {
    try {
      return mapFightEntityToCommon((await this.fightModel.findById(id).exec()).toObject());
    } catch (error) {
      return null
    }
  }


  async createTargettedDuel(charId: string, targetId: string, discordServerId?: string): Promise<Fight> {
    const char = await this.characterService.getById(charId);
    if (!char) throw new NotFoundException(`Char with ID ${charId} not found`);

    if (this.DuelLockManager.isLocked(charId)) // 🔒 Si le personnage est déjà en cours de duel, refuse
      throw new ConflictException("This char is already on fight creation");

    const ONE_HOUR = 1000 * 60 * 60;

    if (char.lastTargettedDuel && Date.now() - char.lastTargettedDuel < ONE_HOUR && !isDev) {
      throw new ForbiddenException("Forbidden, next targetted duel at:" + (char.lastTargettedDuel + ONE_HOUR));
    }

    const target = await this.characterService.getById(targetId);
    if (!target) throw new NotFoundException(`Target with ID ${targetId} not found`);

    this.DuelLockManager.lock(charId); // 🔐 On lock le personnage
    try {
      const fight = await this.createFight({
        team1: {
          teamId: char.id,
          members: [char]
        }, team2: {
          teamId: target.id,
          members: [target]
        }, discordServerId,
        type: 'TARGETTEDDUEL'
      })
      this.characterService.updateLastTargettedDuel(charId)
      this.DuelLockManager.unlock(charId);
      return fight

    } catch (error) {
      this.DuelLockManager.unlock(charId);
      console.log('Error creating targetted fight : ', error)
      throw new InternalServerErrorException('Error while creating targetted fight');
    }

  }
  async createDailyDuel(charId: string, discordServerId?: string): Promise<Fight> {
    const char = await this.characterService.getById(charId);
    if (!char) throw new NotFoundException(`Char with ID ${charId} not found`);

    if (this.DuelLockManager.isLocked(charId)) // 🔒 Si le personnage est déjà en cours de duel, refuse
      throw new ConflictException("This char is already on fight creation");

    if (char.duelsLeft < 1 && !isDev)
      throw new ForbiddenException("No Duels left")

    const opponent = await this.characterService.getRandomCharAroundLevel(char.level, [char.id]);
    if (!opponent)
      throw new NotFoundException(`Opponent Not Found`);

    this.DuelLockManager.lock(charId); // 🔐 On lock le personnage
    try {
      const fight = await this.createFight({
        team1: {
          teamId: char.id,
          members: [char]
        }, team2: {
          teamId: opponent.id,
          members: [opponent]
        }, discordServerId,
        type: 'DAILYDUEL'
      })
      this.characterService.decrementDuelCount(charId)
      this.DuelLockManager.unlock(charId);
      return fight

    } catch (error) {
      this.DuelLockManager.unlock(charId);
      console.log('Error creating dayli fight : ', error)
      throw new InternalServerErrorException('Error while creating daily fight');
    }

  }

  async createProcFight(groupedDiscordUser: Record<string, string[]>): Promise<Fight[]> {
    const allCharFromDb = await this.characterService.getAll();

    const filteredGroupedDiscordCharacter = Object.entries(groupedDiscordUser).reduce<Record<string, Character[]>>((acc, [guildId, userIds]) => {
      const validCharacters = allCharFromDb.filter(char => userIds.includes(char.ownerDiscordId));

      if (validCharacters.length > 0) {
        acc[guildId] = validCharacters;
      }

      return acc;
    }, {});


    const fights: Fight[] = [];

    // 📌 Faire le matchmaking PAR serveur
    for (const [guildId, characters] of Object.entries(filteredGroupedDiscordCharacter)) {

      if (characters.length < 2) {
        console.log(`❗ Pas assez de joueurs pour le serveur ${guildId}, skip`);
        continue;
      }

      // ✅ Génére les matchups (ex: [ [playerA], [playerB] ] → duel)
      const matchups = this.generateMatchups(characters);

      console.log(`✅ Matchmaking pour serveur ${guildId}`);
      for (const [team1, team2] of matchups) {

        try {
          const fight = await this.createFight({
            team1: {
              teamId: team1[0].id,
              members: [...team1]
            }, team2: {
              teamId: team2[0].id,
              members: [...team2]
            }, discordServerId: guildId,
            type: 'PROCDUEL'
          });
          fights.push(fight);
        } catch (error) {
          console.log('❗ Error createProcFight', error);
        }
      }
    }

    return fights;
  }

  async createRaidFight(characterTeam: FightTeam, bossTeam: FightTeam, raidLevel: number): Promise<Fight> {
    try {
      const fight = await this.createFight({
        team1: characterTeam, team2: bossTeam,
        type: 'RAID',
        raidLevel
      })
      return fight

    } catch (error) {
      console.log('Error creating raid fight : ', error)
      throw new InternalServerErrorException('Error while creating raid fight');
    }

  }
  async createTournamentFight(team1: FightTeam, team2: FightTeam): Promise<Fight> {
    try {
      const fight = await this.createFight({
        team1, team2,
        type: 'TOURNAMENT',
      })
      return fight

    } catch (error) {
      console.log('Error creating tournament fight : ', error)
      throw new InternalServerErrorException('Error while creating tournament fight');
    }

  }

  async createFight(data: { team1: FightTeam, team2: FightTeam, discordServerId?: string, type: 'TARGETTEDDUEL' | 'DAILYDUEL' | 'PROCDUEL' | 'RAID' | "TOURNAMENT", raidLevel?: number }): Promise<Fight> {
    const randomToken = generateRandomToken();

    const newFight = new this.fightModel({
      status: 'PENDING',
      teams: [data.team1, data.team2],
      fightToken: randomToken,
      discordServerId: data.discordServerId,
      type: data.type,
      raidLevel: data.raidLevel
    });
    await newFight.save();

    try {
      const dockerManager = new DockerManager();
      const fightContainerData = await dockerManager.launchFightContainer(randomToken);

      newFight.ip = fightContainerData.ip;
      newFight.port = fightContainerData.port;
      newFight.containerId = fightContainerData.containerId;

      await newFight.save();
      const fight = mapFightEntityToCommon(newFight)

      if (['DAILYDUEL', 'PROCDUEL', 'TARGETTEDDUEL'].includes(data.type)) {
        this.NotificationGateway.notifyBot('fight-started',
          { fight }
        )
      }

      fight.teams.map(t => {
        t.members.map(m => {
          this.NotificationGateway.notifyUser(m.ownerId, 'fight-started',
            { fight }
          )
        })
      })

      return fight
    } catch (error) {

      console.error('Error while creating duel fight:', error);
      newFight.status = 'FAILED';
      await newFight.save();

      throw new InternalServerErrorException('Error while creating duel fight');
    }


  }

  generateMatchups(
    characters: Character[],
    options: GenerateMatchupsOptions = {}
  ): Matchup[] {
    const preferSmall = options.preferSmall ?? true;
    const preferSmallRatio = options.preferSmallRatio ?? 0.7;
    const forceEveryone = options.forceEveryone ?? true;

    if (characters.length < 2) {
      throw new Error("Pas assez de joueurs pour créer un matchup.");
    }

    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    const matchups: Matchup[] = [];

    while (shuffled.length >= 2) {
      const totalLeft = shuffled.length;

      const preferDoSmall = preferSmall && Math.random() < preferSmallRatio;

      if (preferDoSmall || totalLeft <= 3) {
        // 📌 On préfère faire un 1v1
        const team1 = [shuffled.shift()!];
        const team2 = [shuffled.shift()!];
        matchups.push([team1, team2]);
      } else {
        // 📌 Faire un plus gros combat → snake balance
        const team1: Character[] = [];
        const team2: Character[] = [];

        while (shuffled.length > 0) {
          if (team1.length <= team2.length) {
            team1.push(shuffled.shift()!);
          } else {
            team2.push(shuffled.shift()!);
          }

          // Stopper si équipes assez remplies pour éviter du 5v5 par erreur
          if (team1.length + team2.length >= 4) break;
        }

        // Si forceEveryone → équilibrage dernier joueur
        if (forceEveryone && Math.abs(team1.length - team2.length) > 1) {
          const biggerTeam = team1.length > team2.length ? team1 : team2;
          const smallerTeam = team1.length < team2.length ? team1 : team2;

          const moved = biggerTeam.pop();
          if (moved) {
            smallerTeam.push(moved);
          }
        }

        matchups.push([team1, team2]);
      }
    }

    if (shuffled.length === 1) {
      // ✅ Dernier joueur → ajouter au dernier matchup → 1v2
      const lastMatchup = matchups[matchups.length - 1];
      lastMatchup[1].push(shuffled.shift()!);
    }

    return matchups;
  }
  async getCurrentDuelFightByCharId(charId: string): Promise<Fight[]> {
    try {
      const fightArray = (await this.fightModel.find({
        status: { $in: ['PENDING', 'ACTIVE'] },
        teams: {
          $elemMatch: {
            members: {
              $elemMatch: { "id": charId }
            }
          }
        }
      }).exec())
      return fightArray.map((f) => mapFightEntityToCommon(f))
    } catch (error) {
      return null
    }
  }
  async getDuelHistoricByCharId(charId: string): Promise<Fight[]> {
    const fightArray = await this.fightModel.find({
      status: { $in: ['FINISH'] },
      teams: {
        $elemMatch: {
          members: {
            $elemMatch: { "id": charId }
          }
        }
      }
    }).exec();
    return fightArray.map((f) => mapFightEntityToCommon(f))
  }
  async getAllDuelByCharId(charId: string): Promise<Fight[]> {
    const fightArray = await this.fightModel.find({
      teams: {
        $elemMatch: {
          members: {
            $elemMatch: { "id": charId }
          }
        }
      },

    },
      { fightLog: 0 }).exec();
    return fightArray.map((f) => mapFightEntityToCommon(f))
  }
  async getAllDuelByUserId(userId: string): Promise<Fight[]> {
    const characters = await this.characterService.findAllCharByOwnerId(userId);
    const charIds = characters.map(c => c.id);

    const fights = await this.fightModel.find({
      'teams.members.id': { $in: charIds },
    }, { fightLog: 0 }).exec();

    return fights.map(mapFightEntityToCommon);
  }

  async handleFightStarted(fight: Fight) {

    const fightDBObject = await this.fightModel.findById(fight.id).exec()
    fightDBObject.status = 'ACTIVE'

    await fightDBObject.save();
  }
  async calculateAndApplyXpReward(teams: FightTeam[], winnerTeamId: string) {
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];

      const teamLevels = team.members.map(member => member.level);
      const teamAverageLevel = teamLevels.reduce((a, b) => a + b, 0) / teamLevels.length;

      const enemyTeams = teams.filter(t => t.teamId !== team.teamId);
      const enemyLevels = enemyTeams.flatMap(t => t.members.map(member => member.level));
      const enemyAverageLevel = enemyLevels.reduce((a, b) => a + b, 0) / enemyLevels.length;

      const levelDiff = enemyAverageLevel - teamAverageLevel;

      let levelDiffXP = 1;

      if (levelDiff >= 1)
        levelDiffXP = 1.5
      else
        levelDiffXP = Math.max(1, levelDiff)


      const baseXP = 33

      const winMultiplier = team.teamId === winnerTeamId ? 1.3 : 1;

      const promises = team.members.map(member => {

        // XP Final
        const xpGained = Math.round(baseXP * winMultiplier * levelDiffXP);

        // Ajout de l'expérience au membre
        return this.characterService.addExperienceToChar(member.id, xpGained);
      });

      await Promise.all(promises);
    }

  }
  async handleFightEnded(fightId: string, endFightDto: EndFightDto) {
    //Récupération du fight
    const fightDBObject = await this.fightModel.findById(fightId).exec();
    if (!fightDBObject) {
      throw new Error('fight ' + fightId + ' not found')
    }

    fightDBObject.status = 'FINISH';
    fightDBObject.winnerTeamId = endFightDto.winnerTeamId
    fightDBObject.fightLog = endFightDto.fightLog

    //Destruction du container
    try {
      const dockerManager = new DockerManager();
      dockerManager.stopFightContainer(fightDBObject.containerId);
    } catch (error) {
      console.error(`Failed to stop container ${fightDBObject.containerId}:`, error);
    }

    //Distribution du butin
    try {
      if (Types.ObjectId.isValid(fightDBObject.winnerTeamId)) {
        const allMembers = fightDBObject.teams.flatMap(t => t.members);
        const winningTeam = fightDBObject.teams.find(t => t.teamId === fightDBObject.winnerTeamId);

        if (fightDBObject.type === 'RAID') {
          if (winningTeam) {
            for (const member of winningTeam.members) {
              await this.characterService.addRaidReward(member.id, fightDBObject.raidLevel)
            }
          }
        } else {
          await this.calculateAndApplyXpReward(fightDBObject.teams, fightDBObject.winnerTeamId)

          // Incrémentation des compteurs pour PROCDUEL
          if (fightDBObject.type === 'PROCDUEL') {
            for (const member of allMembers) {
              await this.characterService.incrementProcDuelCount(member.id);
            }
            if (winningTeam) {
              for (const member of winningTeam.members) {
                await this.characterService.incrementProcDuelWin(member.id);
              }
            }
          }

          // Incrémentation des compteurs pour DAILYDUEL
          if (fightDBObject.type === 'DAILYDUEL') {
            for (const member of allMembers) {
              await this.characterService.incrementDailyDuelCount(member.id);
            }
            if (winningTeam) {
              for (const member of winningTeam.members) {
                await this.characterService.incrementDailyDuelWin(member.id);
              }
            }
          }


        }

      }

    } catch (error) {
      console.error('Erreur lors de la distribution du butin pour les combats :', {
        fightId: fightDBObject._id,
        error: error.message,
        stack: error.stack,
      });
    }


    //Récuperation des donné damage meter
    try {/*
      const newDamageMeter = new this.damageMeterModel({
        fightId: fightDBObject._id,
        damageMeter: endFightDto.damageMeter
      })
      await newDamageMeter.save()
     */
    } catch (error) {
      console.log('Error while saving damagemeter : ', error)
    }


    await fightDBObject.save();

    this.NotificationGateway.notifyBot('fight-ended',
      { fight: mapFightEntityToCommon(fightDBObject) }
    )

    fightDBObject.teams.map(t => {
      t.members.map(m => {
        this.NotificationGateway.notifyUser(m.ownerId, 'fight-ended',
          { fight: mapFightEntityToCommon(fightDBObject) }
        )
      })
    })

    if (fightDBObject.type == 'TOURNAMENT') {
      await this.tournamentService.handleTournamentFightEnded()
    }
  }
}
