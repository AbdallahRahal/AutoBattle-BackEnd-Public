import { forwardRef, Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { CharacterModule } from 'src/character/character.module';
import { FightModule } from 'src/fight/fight.module';
import { NotificationModule } from 'src/notificationSocket/notificationSocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TournamentEntity, TournamentSchema } from './entities/tournament.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CharacterModule,
    forwardRef(() => FightModule),
    NotificationModule,
    UserModule,
    MongooseModule.forFeature([
      { name: TournamentEntity.name, schema: TournamentSchema },
    ])
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule { }
