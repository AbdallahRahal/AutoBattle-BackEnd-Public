import { CombatLog, FightTeam } from '@autobattle/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FightDocument = HydratedDocument<FightEntity>;

@Schema({ timestamps: true })
export class FightEntity {
    @Prop({
        type: String,
        enum: ['PENDING', 'ACTIVE', 'FINISH', 'FAILED'],
        default: 'PENDING',
        required: true,
    })
    status: 'PENDING' | 'ACTIVE' | 'FINISH' | 'FAILED';

    @Prop({
        type: String,
        enum: ['TARGETTEDDUEL', 'DAILYDUEL', 'PROCDUEL', 'RAID', "TOURNAMENT"],
        required: true,
    })
    type: 'TARGETTEDDUEL' | 'DAILYDUEL' | 'PROCDUEL' | 'RAID' | "TOURNAMENT";


    @Prop({
        type: Array,
        validate: {
            validator: (teams: any[]) => teams.length === 2, // Validation pour s'assurer qu'il y a exactement 2 équipes
            message: 'There must be exactly two teams.',
        },
        required: true,
    })
    teams: FightTeam[];


    @Prop({
        type: String,
        required: true,
        select: false, // ne pas supprimer pour protger le token 
    })
    fightToken: string

    @Prop({
        type: String,
    })
    ip: string

    @Prop({
        type: Number,
    })
    port: number

    @Prop({
        type: String,
    })
    winnerTeamId: string

    @Prop({
        type: String,
    })
    containerId: string

    @Prop({
        type: Number,
    })
    fightTime: number

    @Prop({
        type: Number,
    })
    raidLevel: number

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({
        type: String,
        default: () => Math.floor(Math.random() * 9) + 1
    })
    background: string

    @Prop({
        type: Array,
        required: false
    })
    fightLog?: { dateTime: number, combatLog: CombatLog }[];


    @Prop({
        type: String,
        required: false
    })
    discordServerId: string

    _id: MongooseSchema.Types.ObjectId;
    additionalData: any
}

export const FightSchema = SchemaFactory.createForClass(FightEntity);
