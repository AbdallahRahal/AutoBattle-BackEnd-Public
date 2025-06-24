import { Module } from '@nestjs/common';
import { RaidService } from './raid.service';
import { RaidController } from './raid.controller';
import { FightModule } from 'src/fight/fight.module';
import { CharacterModule } from 'src/character/character.module';
import { NotificationModule } from 'src/notificationSocket/notificationSocket.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [FightModule, CharacterModule, NotificationModule, TeamModule],
  controllers: [RaidController],
  providers: [RaidService],
})
export class RaidModule { }
