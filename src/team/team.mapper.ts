import { Character, ClassName, Team } from '@autobattle/common/models';
import { mapItemEntityToCommon } from 'src/item/item.mapper';
import { TeamEntity } from './entities/team.entity';

export function mapTeamEntityToCommon(entity: TeamEntity, members: Character[]): Team {
    return {
        id: entity._id.toString(),
        name: entity.name,
        member: [...members],
        joinCode: entity.joinCode
    };
}
