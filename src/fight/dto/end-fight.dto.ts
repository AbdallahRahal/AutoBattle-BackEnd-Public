import { IsEnum, IsString, IsArray, ValidateNested, isObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CombatLog } from '@autobattle/common/models';

class CharacterDto {
    @IsString()
    charId: string;

    @IsString()
    name: string;
}

class DamageRecordDto {
    @ValidateNested()
    @Type(() => CharacterDto)
    author: CharacterDto;

    @ValidateNested()
    @Type(() => CharacterDto)
    target: CharacterDto;

    @ValidateNested()
    @Type(() => Number)
    value: number;
}

export class EndFightDto {
    @IsString()
    winnerTeamId: string;

    @IsNumber()
    fightTime: number

    @IsArray()
    fightLog: { dateTime: number, combatLog: CombatLog }[];

}