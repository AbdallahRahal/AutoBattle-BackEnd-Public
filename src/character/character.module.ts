import { forwardRef, Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterEntity, CharacterSchema } from './entities/character.entity';
import { ItemModule } from 'src/item/item.module';
import { NotificationModule } from 'src/notificationSocket/notificationSocket.module';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => TeamModule),
    ItemModule,
    UserModule,
    MongooseModule.forFeature([
      { name: CharacterEntity.name, schema: CharacterSchema },
    ])
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule { }
