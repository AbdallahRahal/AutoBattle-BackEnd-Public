import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemEntity } from './entities/item.entity';
import { Item } from '@autobattle/common/models';
import { mapItemEntityToCommon } from './item.mapper';

@Injectable()
export class ItemService {

  constructor(
    @InjectModel(ItemEntity.name) private itemModel: Model<ItemEntity>
  ) {
  }

  async getById(id: string): Promise<Item | null> {
    try {

      const item = await this.itemModel
        .findById(id)
        .exec();

      return item ? mapItemEntityToCommon(item.toObject()) : null;

    } catch (error) {
      return null
    }
  }

  async getMultipleById(ids: string[]): Promise<ItemEntity[] | null> {
    try {
      const items = await this.itemModel.find({
        _id: { $in: ids }
      }).exec();
      return items
    } catch (error) {
      console.log('erreor getMultipleById ', error)
      return null
    }
  }
  async getBySpellId(spellId: number): Promise<Item | null> {
    try {

      const item = await this.itemModel
        .findOne({ spellId })
        .exec();

      return item ? mapItemEntityToCommon(item.toObject()) : null;

    } catch (error) {
      return null
    }
  }
  async getDefaultItem(): Promise<Item | null> {
    try {

      const item = await this.itemModel
        .findOne({ spellId: 1 })
        .exec();

      return item ? mapItemEntityToCommon(item.toObject()) : null;

    } catch (error) {
      return null
    }
  }

  async getRandomItem(): Promise<Item | null> {
    try {
      const items = await this.itemModel.aggregate([
        { $match: { dropable: true } },
        { $sample: { size: 1 } }
      ]);
      return items.length > 0 ? mapItemEntityToCommon(items[0]) : null;
    } catch (error) {
      console.error("[getRandomItem]", error);
      return null;
    }
  }

  async getMultipleRandomItem(numberOfItem: number = 1): Promise<Item[] | null> {
    try {
      const items = await this.itemModel.aggregate([
        { $match: { dropable: true } },
        { $sample: { size: numberOfItem } }
      ]);
      return items.map(mapItemEntityToCommon);
    } catch (error) {
      console.error("[getMultipleRandomItem]", error);
      return null;
    }
  }
  async getBasicItems(): Promise<Item[] | null> {
    try {
      const items = await this.itemModel.aggregate([
        { $match: { isBasic: true } },
      ]);
      return items.map(mapItemEntityToCommon);
    } catch (error) {
      console.error("[getMultipleRandomItem]", error);
      return null;
    }
  }
  async getAll(): Promise<Item[] | null> {
    try {
      const items = await this.itemModel.find().exec();
      return items.map(mapItemEntityToCommon);
    } catch (error) {
      console.log('erreor getMultipleById ', error)
      return null
    }
  }
}
