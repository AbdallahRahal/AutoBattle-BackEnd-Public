import { Fight } from '@autobattle/common/models';
import { mapItemEntityToCommon } from 'src/item/item.mapper';
import { FightEntity } from './entities/fight.entity';

export function mapFightEntityToCommon(entity: FightEntity): Fight {
    return {
        id: entity._id.toString(),
        status: entity.status,
        teams: entity.teams,
        fightToken: entity.fightToken,
        ip: entity.ip,
        port: entity.port,
        winnerTeamId: entity.winnerTeamId,
        fightLog: entity.fightLog,
        containerId: entity.containerId,
        discordServerId: entity.discordServerId,
        fightTime: entity.fightTime,
        createdAt: entity.createdAt,
        background: entity.background,
        raidLevel: entity.raidLevel,
        type: entity.type
    };
}
