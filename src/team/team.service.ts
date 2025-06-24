import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamDocument, TeamEntity } from './entities/team.entity';
import { CharacterService } from 'src/character/character.service';
import { CharacterEntity } from 'src/character/entities/character.entity';
import { mapTeamEntityToCommon } from './team.mapper';
import { mapCharacterEntityWithItemsToCommon } from 'src/character/character.mapper';
import { Team } from '@autobattle/common/models';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(TeamEntity.name) private teamModel: Model<TeamDocument>,
    @Inject(forwardRef(() => CharacterService)) private readonly characterService: CharacterService
  ) { }

  private async generateNextJoinCode(): Promise<number> {
    const lastTeam = await this.teamModel
      .findOne({})
      .sort({ joinCode: -1 })
      .select('joinCode')
      .lean();

    const nextCode = lastTeam?.joinCode != null ? lastTeam.joinCode + 1 : 1;

    if (nextCode > 9999) {
      throw new Error('Maximum number of teams reached (9999)');
    }

    return nextCode;
  }


  async create(charId: string, name: string): Promise<Team | null> {
    const character = await this.characterService.getById(charId);
    if (!character || character.teamId) {
      return null; // Déjà dans une équipe ou personnage inexistant
    }

    const joinCode = await this.generateNextJoinCode();

    const newTeam = new this.teamModel({
      name: name,
      joinCode,
      members: [new Types.ObjectId(charId)],
    });

    const savedTeam = await newTeam.save();
    await this.characterService.setTeamId(charId, savedTeam._id.toString());

    return this.getById(savedTeam._id.toString());
  }

  async join(charId: string, joinCode: number): Promise<Team | null> {
    const character = await this.characterService.getById(charId);
    if (!character || character.teamId) {
      return null; // Déjà dans une équipe ou personnage inexistant
    }

    const team = await this.teamModel.findOne({ joinCode });
    if (!team) return null;
    if (team.members.length >= 3) return null

    team.members.push(new Types.ObjectId(charId));
    await team.save();

    await this.characterService.setTeamId(charId, team._id.toString());

    return this.getById(team._id.toString());
  }

  async leave(charId: string): Promise<boolean> {
    const character = await this.characterService.getById(charId);
    if (!character || !character.teamId) {
      return false; // Pas dans une équipe
    }

    const team = await this.teamModel.findById(character.teamId);
    if (!team) return false;

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== charId,
    );

    if (team.members.length === 0) {
      await team.deleteOne(); // Supprimer équipe vide
    } else {
      await team.save();
    }

    await this.characterService.clearTeamId(charId);

    return true;
  }

  async getById(id: string): Promise<Team | null> {
    try {
      const team = await this.teamModel
        .findById(id)
        .exec();

      if (!team) return null;

      const members = await Promise.all(
        team.toObject().members.map(async (id) => {
          return await this.characterService.getById(id.toString())
        }),
      );

      return mapTeamEntityToCommon(team.toObject(), members);
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }
  async getByCharId(charId: string): Promise<Team | null> {
    const character = await this.characterService.getById(charId);
    if (!character || !character.teamId) {
      return null; // Le personnage n'existe pas ou n'a pas d'équipe
    }

    return this.getById(character.teamId);
  }

  async getByJoinCode(joinCode: number): Promise<Team | null> {
    try {
      const team = await this.teamModel
        .findOne({ joinCode })
        .exec();

      if (!team) return null;

      const members = await Promise.all(
        team.toObject().members.map(async (id) => {
          return await this.characterService.getById(id.toString())
        }),
      );

      return mapTeamEntityToCommon(team.toObject(), members);
    } catch (error) {
      console.error('Error in getByJoinCode:', error);
      return null;
    }
  }

  async getAll(): Promise<Team[]> {
    const teams = await this.teamModel
      .find()
      .exec();

    return Promise.all(
      teams.map(async (team) => {

        const members = await Promise.all(
          team.toObject().members.map(async (id) => {
            return await this.characterService.getById(id.toString())
          }),
        );

        return mapTeamEntityToCommon(team.toObject(), members);
      }),
    );
  }
}
