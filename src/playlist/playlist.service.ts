import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PlaylistEntity} from "./playlist.entity";
import {PlaylistCreation, PlaylistDTO, PlaylistRO} from "./playlist.dto";
import {MusicService} from "../music/music.service";
import {MusicEntity} from "../music/music.entity";
import {UserService} from "../user/user.service";
import {PsychologistDTO} from "../psychologist/psychologist.dto";




@Injectable()
export class PlaylistService {

    constructor(
        @InjectRepository(PlaylistEntity)
        private playlistEntityRepository: Repository<PlaylistEntity>,
        private musicService:MusicService,
        private userService:UserService
    ) {}

    

    async create(playlistCreation:PlaylistCreation,userId:string){
        let playlist = await this.playlistEntityRepository.findOne({where:{name:playlistCreation.name}});
        if(playlist) {
            throw new HttpException('A Playlist with this name already exist', HttpStatus.CONFLICT);
        }
        let musics:string[] = [];
        for (let i = 0; i < playlistCreation.musics.length; i++) {
            let music = await this.musicService.findById(playlistCreation.musics[i]);
            if(music){
                musics.push(playlistCreation.musics[i]);
            }
        }
        let playlistDto:PlaylistDTO = {name:playlistCreation.name,user:userId,musics:musics};
        let playlistCreate = await this.playlistEntityRepository.create(playlistDto);
        console.log(playlistCreate);
        return await this.playlistEntityRepository.save(playlistCreate);
    }

    async findAll(userId:string){
        console.log(userId);
        let playlists = await this.playlistEntityRepository.find({where:{user:userId},relations:['user','musics']});
        let all = await this.playlistEntityRepository.find({relations:['user','musics']});
        console.log(all);
        let playlistsRO:PlaylistRO[] =[];
        playlists.forEach(function(part, index) {
            playlistsRO.push(part.toResponseObject());
        }, playlists);
        return playlistsRO;
    }
    //TODO restrict modification to owner
    async addMusic(playlistId:string,musicId:string,userId:string){
        console.log("p^l"+playlistId);
        let playlist = await this.playlistEntityRepository.findOne({where:{id:playlistId},relations:['user','musics']});
        let musicEntity = await this.musicService.findById(musicId);
        playlist.musics.push(musicEntity);
        return await this.playlistEntityRepository.save( playlist);
    }


    async update(playlistsDto:PlaylistDTO,playlistId:string,userId:string){
        let playlists = await this.playlistEntityRepository.find({where:{id:playlistId,userId:userId}});
        if(!playlists){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return await this.playlistEntityRepository.update(playlistId, playlistsDto);
    }


    async delete(PlaylistId) {
        return await this.playlistEntityRepository.delete(PlaylistId);
    }


    async findById(PlaylistId:string){
        let Playlist = await this.playlistEntityRepository.findOne({where:{id:PlaylistId}});
        if(!Playlist){
            throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
        }
        return Playlist;
    }

}
