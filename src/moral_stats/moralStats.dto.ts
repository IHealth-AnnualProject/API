import { IsNotEmpty } from 'class-validator';
import {Column, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";


export class MoralStatsDTO {

    value: number;

    user:string
}

export class MoralStatsRO{
    @ApiProperty({type:Date})
    created: string;
    @ApiProperty()
    value: number;

}