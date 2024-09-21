import { PartialType } from '@nestjs/mapped-types';
import { CreateRestrictionDto } from './create-restriction.dto';
import { IsString } from 'class-validator';

export class UpdateRestrictionDto {

    @IsString()
    uuid_estudiante: string

    @IsString()
    uuid_restriccion: string
}
