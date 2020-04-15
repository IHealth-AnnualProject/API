import { IsNotEmpty } from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";


export class MoralStatsDTO {
    id: string;

    created: string;

    value: number;

    patient:string
}

export class MoralStatsRO{

    created: string;

    value: number;

}