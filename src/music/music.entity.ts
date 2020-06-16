import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {PlaylistEntity} from "../playlist/playlist.entity";
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

    @ManyToMany(type => PlaylistEntity, playlist => playlist.musics)
    playlist: PlaylistEntity[];

    toResponseObject(): MusicRO {
        let linkDownload = process.env.APP_URL+":"+process.env.APP_PORT+'/music/'+this.id+'/download';
        return {id:this.id,name:this.name,duration:this.duration,linkDownload: linkDownload};
    }
}