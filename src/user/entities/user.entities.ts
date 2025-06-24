import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema()
export class UserEntity {
    @Prop({ required: true })
    discordId: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: true, default: true })
    canTagOnMessage: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: () => ['Villager'] })
    modelList: string[];

    @Prop({ default: 0 })
    randomModelCoin: number;

    _id: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
