import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserDocument } from './entities/user.entities';
import mongoose, { Model } from 'mongoose';
import { User } from '@autobattle/common/models';
import { mapUserEntityToCommon } from './user.mapper';
import characterModelName from 'src/utils/modelName';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserEntity.name) private userModel: Model<UserDocument>) { }

  async findByDiscordId(discordId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ discordId }).exec();
    return user ? mapUserEntityToCommon(user.toObject()) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? mapUserEntityToCommon(user.toObject()) : null;
  }

  async toggleTagUserOnMessage(id: string, canTag: boolean): Promise<void> {
    await this.userModel.updateOne(
      { discordId: id },
      { $set: { canTagOnMessage: canTag } }
    ).exec();
  }

  async getAllStopTagDiscordId(): Promise<string[]> {
    const users = await this.userModel.find(
      { canTagOnMessage: false },
      { discordId: 1 }
    ).exec();

    return users.map(user => user.discordId);
  }


  async create(discordProfile: {
    discordId: string;
    username: string;
    email: string;
  }): Promise<User> {
    const existingUser = await this.findByDiscordId(discordProfile.discordId);
    if (existingUser) {
      throw new ConflictException('User with this Discord ID already exists');
    }

    const createdUser = new this.userModel({
      discordId: discordProfile.discordId,
      username: discordProfile.username,
      email: discordProfile.email,
    });

    return mapUserEntityToCommon((await createdUser.save()).toObject());
  }

  async getUserModel(userId: string) {

    const modelList = await this.userModel.findById(userId,
      { modelList: 1 }
    ).exec();

    return modelList.toObject().modelList

  }


  async unlockRandomModel(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userModel = await this.getUserModel(userId);

    const user = await this.findById(userId);
    if (user.randomModelCoin < 1) {
      throw new ForbiddenException("Not enough coins to unlock a skin.");
    }

    const unlockableCharacterModelName = characterModelName.filter(
      m => !userModel.includes(m)
    );

    if (unlockableCharacterModelName.length === 0) {
      throw new ForbiddenException("No more skins available to unlock.");
    }

    const randomModel = unlockableCharacterModelName[
      Math.floor(Math.random() * unlockableCharacterModelName.length)
    ];

    await this.userModel.updateOne(
      { _id: userObjectId },
      {
        $push: { modelList: randomModel },
        $inc: { randomModelCoin: -1 }
      }
    ).exec();

    return randomModel;
  }

  async addModelCoin(userId: string, number = 1) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await this.userModel.updateOne(
      { _id: userObjectId },
      {
        $inc: { randomModelCoin: number }
      }
    ).exec();

  }
}