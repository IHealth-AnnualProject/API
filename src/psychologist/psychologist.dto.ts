import {ApiPropertyOptional} from "@nestjs/swagger";
import {UserRO} from "../user/user.dto";


export class PsychologistDTO {
    @ApiPropertyOptional()
    first_name: string;
    @ApiPropertyOptional()
    last_name: string;
    @ApiPropertyOptional()
    email:string;
    @ApiPropertyOptional()
    username:string;
    @ApiPropertyOptional()
    birthdate: string;
    @ApiPropertyOptional()
    geolocation:string;
    @ApiPropertyOptional()
    user:UserRO;
}

export class PsychologistDTOID {
    @ApiPropertyOptional()
    id :string;
    @ApiPropertyOptional()
    first_name: string;
    @ApiPropertyOptional()
    last_name: string;
    @ApiPropertyOptional()
    email:string;
    @ApiPropertyOptional()
    birthdate: Date;
    @ApiPropertyOptional()
    geolocation:string;
    @ApiPropertyOptional()
    user;
}

export class PsychologistRO{
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    email:string;
    @ApiPropertyOptional()
    first_name: string;
    @ApiPropertyOptional()
    last_name: string;
    @ApiPropertyOptional()
    user:UserRO;
    @ApiPropertyOptional()
    birthdate: Date;
    @ApiPropertyOptional()
    description:string;
    @ApiPropertyOptional()
    geolocation:string
}