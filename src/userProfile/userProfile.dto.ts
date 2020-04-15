import {IsNotEmpty, IsNotEmptyObject, IsString} from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";


export class UserProfileDTO {
    first_name: string;
    last_name: string;
    age: number;
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