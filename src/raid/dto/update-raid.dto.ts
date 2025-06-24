import { PartialType } from '@nestjs/mapped-types';
import { CreateRaidDto } from './create-raid.dto';

export class UpdateRaidDto extends PartialType(CreateRaidDto) {}
