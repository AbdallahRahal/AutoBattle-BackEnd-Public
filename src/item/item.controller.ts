import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, ForbiddenException, ConflictException, BadRequestException, Put, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from '@autobattle/common/models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/auth.decorator';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }


    @Public()
    @Get('all')
    async getAll(): Promise<Item[]> {
        const item = await this.itemService.getAll();
        if (!item) {
            throw new NotFoundException(`Error getting all Items`);
        }
        return item
    }

    @Public()
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Item> {
        const item = await this.itemService.getById(id);
        if (!item) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }
        return item
    }

}