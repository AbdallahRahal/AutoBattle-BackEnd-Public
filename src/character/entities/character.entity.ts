import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { ClassAllocationPointDistribution, ClassRecord, StatAllocationPointDistribution, StatRecord } from '@autobattle/common/models';
import { ItemEntity } from 'src/item/entities/item.entity';
import { defaultCharInitialStats } from '../utils/defaultCharStat';
import { defaultCharInitialClass } from '../utils/defaultCharClasse';
import { defaultClassAllocationPointDistribution } from '../utils/defaultClassAllocationPointDistribution';
import { defaultStatAllocationPointDistribution } from '../utils/defaultStatAllocationPointDistribution';

export type CharacterDocument = HydratedDocument<CharacterEntity>;
export type CharacterEntityWithItems = Omit<CharacterEntity, 'items' | 'classItems' | 'itemChoice'> & {
    items: ItemEntity[],
    classItems: ItemEntity[],
    itemChoice: Record<string, ItemEntity[]>
};

@Schema()
export class CharacterEntity {
    @Prop({ required: true, minlength: 3 })
    name: string;

    @Prop({ default: 1 })
    level: number;

    @Prop({ default: 0 })
    experience: number;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ItemEntity' }],
        default: () => []
    })
    items: Types.ObjectId[];

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ItemEntity' }],
        default: () => []
    })
    classItems: Types.ObjectId[];

    @Prop({
        type: Object,
        default: () => ({ ...defaultCharInitialStats }),
    })
    baseStats: StatRecord;

    @Prop({
        type: Object,
        default: () => ({ ...defaultCharInitialClass })
    })
    baseClass: ClassRecord

    @Prop({
        type: Object,
        default: () => ({}),
    })
    computedStats: StatRecord;

    @Prop({
        type: Object,
        default: () => ({})
    })
    computedClass: ClassRecord

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    ownerId: Types.ObjectId;

    @Prop({ required: true })
    ownerDiscordId: string

    @Prop({ required: true })
    baseDiscordServerId: string

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({
        type: Object,
        default: () => ({}),
    })
    itemChoice: Record<string, Types.ObjectId[]>;

    @Prop({ required: true, default: 5 })
    duelsLeft: number;

    @Prop({
        type: String,
        default: 'Villager'
    })
    modelName: string

    @Prop({
        type: String,
        default: 'Player'
    })
    figherType: 'Player';


    @Prop({ required: true, default: 0 })
    statAllocationPoint: number

    @Prop({
        type: Object,
        default: () => ({ ...defaultStatAllocationPointDistribution })
    })
    statAllocationPointDistribution: StatAllocationPointDistribution


    @Prop({ required: true, default: 0 })
    classAllocationPoint: number

    @Prop({
        type: Object,
        default: () => ({ ...defaultClassAllocationPointDistribution })
    })
    classAllocationPointDistribution: ClassAllocationPointDistribution


    @Prop({ required: true, default: 0 })
    procDuelCount: number
    @Prop({ required: true, default: 0 })
    procDuelWin: number

    @Prop({ required: true, default: 0 })
    dailyDuelCount: number
    @Prop({ required: true, default: 0 })
    dailyDuelWin: number

    @Prop({ required: true, default: 0 })
    itemReroll: number

    @Prop({ default: null })
    teamId?: string | null

    @Prop({ required: true, default: 0 })
    lastTargettedDuel: number

    _id: Types.ObjectId;
}

export const CharacterSchema = SchemaFactory.createForClass(CharacterEntity);

