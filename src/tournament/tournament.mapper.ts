import { Tournament } from "@autobattle/common/models";
import { TournamentEntityWithFight } from "./entities/tournament.entity";

export function mapTournamentEntityToCommon(entity: TournamentEntityWithFight): Tournament {
    return {
        id: entity._id.toString(),
        status: entity.status,
        rounds: entity.rounds,
        allFightTeams: entity.allFightTeams,
        aliveFightTeams: entity.aliveFightTeams,
        winnerTeamId: entity.winnerTeamId,
    };
}
