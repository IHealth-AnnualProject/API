import {IsNotEmpty, IsNotEmptyObject, IsString} from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';


export class UserProfileDTO {
    @ApiPropertyOptional()
    first_name: string;
    @ApiPropertyOptional()
    last_name: string;
    @ApiPropertyOptional()
    age: number;
    @ApiPropertyOptional()
    geolocation:string;

    user;
}

export class UserProfileRO{
    id:string;
    first_name: string;

    last_name: string;

    age: number;

    description:string;
}