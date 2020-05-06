import {IsNotEmpty, IsNotEmptyObject, IsString} from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {MoralStatsDTO} from "../moral_stats/moralStats.dto";
import {UserRO} from "../user/user.dto";
import {UserEntity} from "../user/user.entity";


export class UserProfileDTOID {
    id:string;
    @ApiPropertyOptional()
    geolocation:string;
    @ApiPropertyOptional()
    description: string;
    @ApiPropertyOptional()
    email:string;

    moralStats:[MoralStatsDTO];

    user;
}

export class UserProfileDTO {

    @ApiPropertyOptional()
    geolocation:string;
    @ApiPropertyOptional()
    description: string;
    @ApiPropertyOptional()
    email:string;

    moralStats:[MoralStatsDTO];

    user;
}

export class UserProfileRO{
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    email: string;
    @ApiPropertyOptional()
    description:string;
    @ApiPropertyOptional()
    user:UserRO
}