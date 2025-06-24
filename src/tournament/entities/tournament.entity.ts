

import { FightTeam, TournamentRound } from '@autobattle/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type TournamentDocument = HydratedDocument<TournamentEntity>;
export type TournamentEntityWithFight = Omit<TournamentEntity, 'rounds'> & {
    rounds: TournamentRound[],
};

@Schema()
export class TournamentEntityRound {
    @Prop({ type: [String], default: [] })
    teams: string[];

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'FightEntity' }],
        default: () => []
    })
    fights: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class TournamentEntity {
    @Prop({
        type: String,
        enum: ['ACTIVE', 'FINISH', 'FAILED'],
        default: 'ACTIVE',
        required: true,
    })
    status: 'ACTIVE' | 'FINISH' | 'FAILED';

    @Prop({ type: [TournamentEntityRound], default: [] })
    rounds: TournamentEntityRound[]; // Tableau deround

    @Prop({ default: [] })
    allFightTeams: FightTeam[];

    @Prop({ default: [] })
    aliveFightTeams: FightTeam[];

    @Prop({
        type: String,
    })
    winnerTeamId: string

    _id: MongooseSchema.Types.ObjectId;
}
export const TournamentSchema = SchemaFactory.createForClass(TournamentEntity);