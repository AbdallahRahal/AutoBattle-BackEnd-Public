import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Public } from 'src/auth/auth.decorator';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) { }


  @Get()
  async getTournament() {
    return await this.tournamentService.getTournament();
  }

  @Public()
  @Post('triggerTournament/verriunre34ff')
  async triggerRaidNow() {
    console.log('Tournoi lancé manuellement')
    await this.tournamentService.launchTournamentByHands();
    return true
  }
}