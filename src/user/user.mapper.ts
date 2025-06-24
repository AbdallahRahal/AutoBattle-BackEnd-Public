import { User } from "@autobattle/common/models";
import { UserEntity } from "./entities/user.entities";

export function mapUserEntityToCommon(entity: UserEntity): User {
    return {
        id: entity._id.toString(),
        discordId: entity.discordId,

        username: entity.username,
        email: entity.email,

        canTagOnMessage: entity.canTagOnMessage,

        modelList: entity.modelList,
        randomModelCoin: entity.randomModelCoin

    };
}
