import { IsString, Length } from "class-validator";


export class CreateRestrictionDto {

    @IsString()
    uuid_estudiante: string

    @IsString()
    @Length(5,1000)
    razon: string
}
