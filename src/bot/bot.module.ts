import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { CharacterModule } from 'src/character/character.module';
import { FightModule } from 'src/fight/fight.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CharacterModule, FightModule, AuthModule, UserModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule { }
