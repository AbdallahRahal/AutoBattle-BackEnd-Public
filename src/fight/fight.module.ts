import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { CharacterModule } from 'src/character/character.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FightEntity, FightSchema } from './entities/fight.entity';
import { NotificationModule } from 'src/notificationSocket/notificationSocket.module';
import { DamageMeter, DamageMeterSchema } from './entities/damageMeter.entity';
import { ItemModule } from 'src/item/item.module';
import { TournamentModule } from 'src/tournament/tournament.module';

@Module({
  imports: [
    CacheModule.register(),
    forwardRef(() => NotificationModule),
    ItemModule,
    forwardRef(() => CharacterModule),
    forwardRef(() => TournamentModule),


    MongooseModule.forFeature([
      { name: FightEntity.name, schema: FightSchema },
      { name: DamageMeter.name, schema: DamageMeterSchema },
    ]),
  ],
  controllers: [FightController],
  providers: [FightService],
  exports: [FightService]
})
export class FightModule { }
