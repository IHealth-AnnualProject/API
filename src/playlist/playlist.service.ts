import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PlaylistEntity} from "./playlist.entity";
import {PlaylistCreation, PlaylistDTO, PlaylistRO} from "./playlist.dto";
import {MusicService} from "../music/music.service";
import {UserService} from "../user/user.service";





@Injectable()
export class PlaylistService {

    constructor(
        @InjectRepository(PlaylistEntity)
        private playlistEntityRepository: Repository<PlaylistEntity>,
        private musicService:MusicService,
        private userService:UserService
    ) {}

    

    async create(playlistCreation:PlaylistCreation,userId:string){
        let playlist = await this.playlistEntityRepository.findOne({where:{name:playlistCreation.name,user:userId}});
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
        return await this.playlistEntityRepository.save(playlistCreate);
    }

    async findAll(userId:string){
        let playlists = await this.playlistEntityRepository.find({where:{user:userId},relations:['user','musics']});
        let playlistsRO:PlaylistRO[] =[];
        playlists.forEach(function(part, index) {
            playlistsRO.push(part.toResponseObject());
        }, playlists);
        return playlistsRO;
    }

    async addMusic(playlistId:string,musicId:string,userId:string){
        let playlist = await this.playlistEntityRepository.findOne({where:{id:playlistId},relations:['user','musics']});
        if(playlist.user.id!==userId){
            throw new HttpException('Its not your playlist', HttpStatus.UNAUTHORIZED);
        }
        let musicEntity = await this.musicService.findById(musicId);
        playlist.musics.push(musicEntity);
        return await this.playlistEntityRepository.save( playlist);
    }

    async deleteMusic(playlistId:string,musicId:string,userId:string){
        let playlist = await this.playlistEntityRepository.findOne({where:{id:playlistId},relations:['user','musics']});
        if(playlist.user.id!==userId){
            throw new HttpException('Its not your playlist', HttpStatus.UNAUTHORIZED);

        }
        for (let i = 0; i < playlist.musics.length; i++) {
            if(playlist.musics[i].id === musicId){
                playlist.musics.splice(i,1);
                return await this.playlistEntityRepository.save( playlist);
            }
        }
        throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
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


    async findById(PlaylistId:string,userId:string){
        let playlist = await this.playlistEntityRepository.findOne({where:{id:PlaylistId},relations:['user','musics']});
        if(!playlist){
            throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
        }
        if(playlist.user.id!==userId){
            throw new HttpException('Its not your playlist', HttpStatus.UNAUTHORIZED);

        }
        return playlist;
    }

}
