import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MusicRO} from "../music/music.dto";
import {MusicEntity} from "../music/music.entity";
import {FriendsEntity} from "../friends/friends.entity";
import {PlaylistRO} from "./playlist.dto";
import {UserEntity} from "../user/user.entity";



@Entity('playlist')
export class PlaylistEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @ManyToMany(type =>MusicEntity,music=>music.playlist,{
        cascade: true
    })
    @JoinTable()
    musics: MusicEntity[];

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;


    toResponseObject(): PlaylistRO {
        let musicsRO:MusicRO[] =[];
        this.musics.forEach(function(part, index) {
            musicsRO.push(part.toResponseObject());
        }, this.musics);
        return {id:this.id,name:this.name,musics:musicsRO};
    }
}