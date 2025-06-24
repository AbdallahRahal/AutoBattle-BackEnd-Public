import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { CharacterEntity } from 'src/character/entities/character.entity';

export type TeamDocument = HydratedDocument<TeamEntity>;

@Schema()
export class TeamEntity {

    @Prop({ required: true, minlength: 3 })
    name: string;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CharacterEntity' }],
        default: () => []
    })
    members: Types.ObjectId[];

    @Prop({ required: true, unique: true })
    joinCode: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    _id: Types.ObjectId;
}

export const TeamSchema = SchemaFactory.createForClass(TeamEntity);

