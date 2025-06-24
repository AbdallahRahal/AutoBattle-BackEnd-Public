import { StatRecord, ClassRecord } from '@autobattle/common/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ItemDocument = HydratedDocument<ItemEntity>;

@Schema({ timestamps: true })
export class ItemEntity {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    dropable: boolean;

    @Prop({ required: true })
    isBasic: boolean;

    @Prop({ required: true })
    isClassItem: boolean;

    @Prop({
        type: Object,
        default: () => ({}),
    })
    stats: StatRecord;

    @Prop({
        type: Object,
        default: () => ({})
    })
    class: ClassRecord

    @Prop()
    spellId?: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: '' })
    icon: string;

    updatedAt: Date;
    _id: MongooseSchema.Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(ItemEntity);
