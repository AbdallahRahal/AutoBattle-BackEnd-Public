import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity, ItemSchema } from './entities/item.entity';
import { ItemController } from './item.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ItemEntity.name, schema: ItemSchema }]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule { }
