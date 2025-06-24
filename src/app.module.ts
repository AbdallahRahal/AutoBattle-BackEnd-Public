import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CharacterModule } from './character/character.module';
import { FightModule } from './fight/fight.module';
import { ItemModule } from './item/item.module';
import { AppController } from './app/app.controller';
import { NotificationModule } from './notificationSocket/notificationSocket.module';
import { BotModule } from './bot/bot.module';
import { RaidModule } from './raid/raid.module';
import { TournamentModule } from './tournament/tournament.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseName = process.env.NODE_ENV === 'development' ? 'Dev' : 'test';
        const user = configService.get<string>('MONGO_USER');
        const password = configService.get<string>('MONGO_PASSWORD');
        const cluster = configService.get<string>('MONGO_CLUSTER');
        const uri = `mongodb+srv://${user}:${password}@${cluster}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    FightModule,
    UserModule,
    CharacterModule,
    ItemModule,
    NotificationModule,
    BotModule,
    RaidModule,
    TournamentModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
