import { forwardRef, Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { CharacterModule } from 'src/character/character.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamEntity, TeamSchema } from './entities/team.entity';

@Module({
  imports: [
    forwardRef(() => CharacterModule),
    MongooseModule.forFeature([
      { name: TeamEntity.name, schema: TeamSchema },
    ])
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule { }
