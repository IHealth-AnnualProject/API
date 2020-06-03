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
        let linkDownload = process.env.APP_URL+":"+process.env.APP_PORT+'/music/'+this.id+'/download';
        return {id:this.id,name:this.name,duration:this.duration,linkDownload: linkDownload};
    }
}