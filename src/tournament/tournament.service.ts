import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TournamentEntity, TournamentEntityRound, TournamentEntityWithFight } from './entities/tournament.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema as MongooseSchema } from 'mongoose';

import { FightService } from 'src/fight/fight.service';
import { CharacterService } from 'src/character/character.service';
import shuffleArray from 'src/utils/shuffleArray';
import { FightTeam, Tournament, TournamentRound } from '@autobattle/common/models';
import { NotificationGateway } from 'src/notificationSocket/notificationSocket.gateway';
import { mapTournamentEntityToCommon } from './tournament.mapper';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(TournamentEntity.name) private tournamentModel: Model<TournamentEntity>,
    @Inject(forwardRef(() => FightService))
    private readonly fightService: FightService,
    @Inject(forwardRef(() => CharacterService))
    private readonly characterService: CharacterService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly NotificationGateway: NotificationGateway,
    private readonly userService: UserService

  ) { }

  async onModuleInit() {
    await this.scheduleWednesdayTournament();
    await this.scheduleSundayTournament();
  }

  async scheduleWednesdayTournament() {
    const nextWednesday = this.getNextWeekday(3); // 3 = mercredi
    const now = DateTime.now().setZone('Europe/Paris');
    const delay = nextWednesday.diff(now).as('milliseconds');

    console.log(`Tournoi de mercredi planifié à ${nextWednesday.toISO()}`);

    setTimeout(() => {
      this.launchTournament();
      this.scheduleWednesdayTournament(); // reschedule pour la semaine suivante
    }, delay);
  }

  async scheduleSundayTournament() {
    const nextSunday = this.getNextWeekday(7); // 7 = dimanche
    const now = DateTime.now().setZone('Europe/Paris');
    const delay = nextSunday.diff(now).as('milliseconds');

    console.log(`Tournoi de dimanche planifié à ${nextSunday.toISO()}`);

    setTimeout(() => {
      this.launchTournament();
      this.scheduleSundayTournament(); // reschedule pour la semaine suivante
    }, delay);
  }

  getNextWeekday(weekday: number): DateTime {
    const now = DateTime.now().setZone('Europe/Paris');
    let next = now.set({ hour: 20, minute: 0, second: 0, millisecond: 0 });

    while (next.weekday !== weekday || next <= now) {
      next = next.plus({ days: 1 });
    }

    return next;
  }

  async getTournament(): Promise<Tournament | null> {
    try {
      const tournament = await this.tournamentModel
        .findOne()
        .populate<{ rounds: TournamentRound[] }>('rounds')
        .sort({ createdAt: -1 })
        .exec();

      if (!tournament) {
        return null;
      }

      const tournamentEntityWithFight: TournamentEntityWithFight = {
        ...tournament.toObject(),
        rounds: []
      }
      // Pour chaque round du tournoi
      for (const round of tournament.rounds) {
        // Remplacer chaque ID de fight par les vraies données
        const enrichedFights = await Promise.all(
          round.fights.map(async (fightId: any) => {
            const fight = await this.fightService.getFightById(fightId.toString());
            return fight;
          })
        );

        tournamentEntityWithFight.rounds.push({
          teams: round.teams,
          fights: enrichedFights
        })
      }

      return mapTournamentEntityToCommon(tournamentEntityWithFight);
    } catch (error) {
      console.error('Error getting tournament:', error);
      return null;
    }
  }



  async launchTournamentByHands() {
    await this.launchTournament()
  }

  async launchTournament() {
    console.log('Lancement du tournoi...');

    const allChar = await this.characterService.getAll();
    console.log('Nombre de char pour le tournoi :', allChar.length);

    let allFightTeams: FightTeam[] = [];

    for (const char of allChar) {
      const fightTeam: FightTeam = {
        teamId: char.id,
        members: [char]
      };

      allFightTeams.push(fightTeam);
    }

    console.log('Nombre de char préparées pour le tournoi :', allFightTeams.length);

    const tournament = new this.tournamentModel({
      status: 'ACTIVE',
      allFightTeams,
      aliveFightTeams: [...allFightTeams],
    });

    await tournament.save();
    this.NotificationGateway.notifyAll("tournament-started", {})

    console.log("Création premier Round")

    await this.launchNextRound()
    this.NotificationGateway.notifyAll("tournament-changed", {})

  }

  private async launchNextRound(): Promise<void> {
    const tournament = await this.tournamentModel
      .findOne({ status: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .exec();

    if (!tournament) {
      console.warn('Aucun tournoi actif trouvé.');
      return;
    }
    tournament.aliveFightTeams = shuffleArray(tournament.aliveFightTeams)
    console.log('\n\n Lancement du round suivant avec les Char en lice :', tournament.aliveFightTeams.map(t => t.teamId));

    const round: TournamentEntityRound = {
      teams: [],
      fights: [],
    };

    for (let i = 0; i < tournament.aliveFightTeams.length; i += 2) {
      const team1 = tournament.aliveFightTeams[i];
      const team2 = tournament.aliveFightTeams[i + 1];
      round.teams.push(team1.teamId);

      if (!team2) {
        console.log(`Char ${team1.teamId} passe automatiquement.`);
        continue;
      }

      round.teams.push(team2.teamId);

      console.log(`Création d’un combat entre ${team1.teamId} et ${team2.teamId}`);
      const tournamentFight = await this.fightService.createTournamentFight(team1, team2);
      round.fights.push(new mongoose.Types.ObjectId(tournamentFight.id));
    }

    tournament.rounds.push(round);
    await tournament.save();
  }

  async handleTournamentFightEnded(): Promise<void> {
    try {
      const tournament = await this.tournamentModel
        .findOne({ status: 'ACTIVE' })
        .sort({ createdAt: -1 })
        .exec();

      if (!tournament) {
        console.warn('Aucun tournoi actif trouvé.');
        return;
      }

      const lastRound = tournament.rounds[tournament.rounds.length - 1];

      if (!lastRound) {
        console.warn('Aucun round trouvé dans le tournoi.');
        return;
      }

      const fightStatuses = await Promise.all(
        lastRound.fights.map(async (fightId) => {
          const fight = await this.fightService.getFightById(fightId.toString());

          const winnerTeamId = fight?.winnerTeamId || null;
          const teamAId = fight?.teams[0]?.teamId || null;
          const teamBId = fight?.teams[1]?.teamId || null;

          let looserTeamId: string | null = null;

          if (fight?.status === 'FINISH' && teamAId && teamBId && winnerTeamId) {
            looserTeamId = winnerTeamId === teamAId ? teamBId : teamAId;
          }

          return {
            fightId,
            finished: fight?.status === 'FINISH',
            winnerTeamId,
            looserTeamId,
          };
        })
      );

      const allFinished = fightStatuses.every(f => f.finished);

      if (!allFinished) {
        console.log('Tous les combats ne sont pas encore terminés.');
        this.NotificationGateway.notifyAll("tournament-changed", {})

        return;
      }

      console.log('Tous les combats sont terminés.');

      const looserTeams: string[] = fightStatuses
        .map(f => f.looserTeamId)
        .filter((id): id is string => id !== null);

      // 🔻 Supprimer les losers de aliveFightTeams
      tournament.aliveFightTeams = tournament.aliveFightTeams.filter(team => !looserTeams.includes(team.teamId));
      await tournament.save();

      // ✅ 1 seul gagnant : tournoi terminé
      if (tournament.aliveFightTeams.length === 1) {
        const winner = tournament.aliveFightTeams[0];
        console.log(`Tournoi terminé, vainqueur : ${winner.teamId}`);
        for (let i = 0; i < winner.members.length; i++) {
          const m = winner.members[i];
          await this.userService.addModelCoin(m.ownerId)

        }

        tournament.status = 'FINISH';
        tournament.winnerTeamId = winner.teamId;
        await tournament.save();
        this.NotificationGateway.notifyAll("tournament-changed", {})

        return;
      }

      // ✅ Plus de 1 équipe restante : prochain round
      if (tournament.aliveFightTeams.length > 1) {
        await this.launchNextRound();
        this.NotificationGateway.notifyAll("tournament-changed", {})
        return;
      }

      // ❌ Aucune équipe survivante : erreur
      console.warn('Aucun gagnant détecté pour les combats de ce round.');
      tournament.status = 'FAILED';
      await tournament.save();
      this.NotificationGateway.notifyAll("tournament-changed", {})

    } catch (error) {
      console.error('Erreur dans handleTournamentFightEnded:', error);
    }
  }

}