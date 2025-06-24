import { IsEnum, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFightDto } from './create-fight.dto';

export class UpdateFightDto extends PartialType(CreateFightDto) {
    @IsEnum(['PENDING', 'ACTIVE', 'FINISH'], {
        message: 'status must be one of PENDING, ACTIVE, or FINISH',
    })
    status: 'PENDING' | 'ACTIVE' | 'FINISH';

}
