import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PlaylistEntity} from "./playlist.entity";
import {PlaylistCreation, PlaylistDTO, PlaylistRO} from "./playlist.dto";
import {MusicService} from "../music/music.service";
import {MusicEntity} from "../music/music.entity";
import {UserService} from "../user/user.service";




@Injectable()
export class PlaylistService {

    constructor(
        @InjectRepository(PlaylistEntity)
        private PlaylistEntityRepository: Repository<PlaylistEntity>,
        private musicService:MusicService,
        private userService:UserService
    ) {}

    

    async create(playlistCreation:PlaylistCreation,userId:string){
        let playlist = await this.PlaylistEntityRepository.findOne({where:{name:playlistCreation.name}});
        if(playlist) {
            throw new HttpException('A Playlist with this name already exist', HttpStatus.CONFLICT);
        }
        let musics:MusicEntity[] = [];
        playlistCreation.musics.forEach(async function(id){
            let music = await this.musicService.findOne({where:{id:id}});
            if(music){
                musics.push(music);
            }
        });
        let user = await this.userService.findOneById(userId);
        let playlistDto:PlaylistDTO = {name:playlistCreation.name,user:user,musics:musics};
        let playlistCreate = await this.PlaylistEntityRepository.create(playlistDto);
        await this.PlaylistEntityRepository.save(playlistCreate);
        return playlist.toResponseObject();
    }

    async findAll(userId:string){
        let playlists = await this.PlaylistEntityRepository.find({where:{user:userId}});
        let playlistsRO:PlaylistRO[];
        playlists.forEach(function(part, index) {
            playlistsRO.push(part.toResponseObject());
        }, playlists);
        return playlistsRO;
    }

    async delete(PlaylistId) {
        return await this.PlaylistEntityRepository.delete(PlaylistId);
    }


    async findById(PlaylistId:string){
        let Playlist = await this.PlaylistEntityRepository.findOne({where:{id:PlaylistId}});
        if(!Playlist){
            throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
        }
        return Playlist;
    }

}
