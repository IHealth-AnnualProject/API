import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {MusicRO} from "./music.dto";


@Entity('music')
export class MusicEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('int')
    duration: number;

    @Column('text')
    filename:string;

    toResponseObject(): MusicRO {
        return {id:this.id,name:this.name,duration:this.duration};
    }
}