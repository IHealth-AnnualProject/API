import { IsNotEmpty } from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";


export class MoralStatsDTO {

    value: number;

    user:string
}

export class MoralStatsRO{

    created: string;

    value: number;

}