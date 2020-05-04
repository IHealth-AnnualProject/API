import { IsNotEmpty } from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";


export class PsychologistDTO {
    first_name: string;

    last_name: string;

    age: number;

    geolocation:string;

    user;
}

export class PsychologistDTOID {
    id :string;
    first_name: string;

    last_name: string;

    age: number;

    geolocation:string;

    user;
}

export class PsychologistRO{
    id:string;

    first_name: string;

    last_name: string;

    age: number;

    description:string;
}