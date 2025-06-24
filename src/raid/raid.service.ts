import { Injectable, OnModuleInit } from '@nestjs/common';
import { FightService } from 'src/fight/fight.service';
import sleep from 'src/utils/sleep';
import { DateTime } from 'luxon';
import { CharacterService } from 'src/character/character.service';
import { Character, FightTeam, Team } from '@autobattle/common/models';
import { BOSS_1_Team } from './utils/BOSS_1_Team';
import { BOSS_2_Team } from './utils/BOSS_2_Team';
import { BOSS_3_Team } from './utils/BOSS_3_Team';
import { BOSS_4_Team } from './utils/BOSS_4_Team';
import { NotificationGateway } from 'src/notificationSocket/notificationSocket.gateway';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class RaidService implements OnModuleInit {
  private isRaidScheduled = false;

  constructor(private readonly fightService: FightService,
    private readonly characterService: CharacterService,
    private readonly teamService: TeamService,
    private readonly NotificationGateway: NotificationGateway,
  ) { }


  async onModuleInit() {
    await this.waitUntilNextRaid(20); // 20h heure française
  }

  private async waitUntilNextRaid(hour: number): Promise<void> {
    if (this.isRaidScheduled) {
      console.warn('Raid déjà programmé, appel ignoré.');
      return;
    }

    this.isRaidScheduled = true;

    // Date actuelle en heure française (Europe/Paris)
    const now = DateTime.now().setZone('Europe/Paris');
    let nextRaid = now.set({ hour, minute: 0, second: 0, millisecond: 0 });

    // Si l'heure est déjà passée aujourd'hui, on programme pour demain
    if (now >= nextRaid) {
      nextRaid = nextRaid.plus({ days: 1 });
    }

    const delay = nextRaid.toMillis() - now.toMillis();

    this.printRaidDelay(delay);

    setTimeout(async () => {
      await this.launchRaids();

      // Replanification automatique
      this.isRaidScheduled = false;
      await this.waitUntilNextRaid(hour);
    }, delay);
  }


  private printRaidDelay(delay: number) {
    const hours = Math.floor(delay / (1000 * 60 * 60));
    const minutes = Math.floor((delay % (1000 * 60 * 60)) / (1000 * 60));
    console.log(`\n\n⏳⏳⏳ Raid programmé dans ${hours}h${minutes.toString().padStart(2, '0')} ⏳⏳⏳\n\n`);
  }

  private async launchRaids() {
    const teams: Team[] = await this.teamService.getAll();
    const now = DateTime.now().setZone('Europe/Paris');

    // Luxon: 1 = lundi, 7 = dimanche
    const weekday = now.weekday;

    let bossTeam: FightTeam;
    let bossLevel: number;

    switch (weekday) {
      case 1: // Lundi
        bossTeam = BOSS_1_Team;
        bossLevel = 1;
        break;
      case 2: // Mardi
        bossTeam = BOSS_2_Team;
        bossLevel = 2;
        break;
      case 4: // Jeudi
        bossTeam = BOSS_3_Team;
        bossLevel = 3;
        break;
      case 5: // Vendredi
        bossTeam = BOSS_4_Team;
        bossLevel = 4;
        break;
      case 6: // Samedi
        bossTeam = BOSS_4_Team;
        bossLevel = 5;
        break;
      default:
        console.log('📅 Pas de raid prévu aujourd’hui.');
        return;
    }


    console.log(`🔥 Lancement des raids pour le jour ${now.weekdayLong} (Boss ${bossLevel})`);
    this.NotificationGateway.notifyAll("raid-started", {})

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      await this.fightService.createRaidFight({
        teamId: team.id,
        members: [...team.member]
      },
        bossTeam, bossLevel);
      await sleep(3000);
    }
  }



  public async launchRaidByHands() {
    return this.launchRaids()
  }

}