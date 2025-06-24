import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RaidService } from './raid.service';
import { CreateRaidDto } from './dto/create-raid.dto';
import { UpdateRaidDto } from './dto/update-raid.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('raid')
export class RaidController {
  constructor(private readonly raidService: RaidService) { }

  @Public()
  @Post('triggerRaid/verriunre34ff')
  async triggerRaidNow() {
    console.log('Raid lancé manuellement')
    await this.raidService.launchRaidByHands();
    return true
  }
}
