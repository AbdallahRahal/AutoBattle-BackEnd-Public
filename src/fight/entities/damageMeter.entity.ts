import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DamageMeterDocument = HydratedDocument<DamageMeter>;

@Schema({ timestamps: true })
export class DamageMeter {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Fight', required: true })
    fightId: string;


    @Prop({ type: [Object], required: true })
    damageMeter: {
        author: { charId: string; name: string };
        target: { charId: string; name: string };
        value: Number;
    }[];


    _id: MongooseSchema.Types.ObjectId;
}

export const DamageMeterSchema = SchemaFactory.createForClass(DamageMeter);
