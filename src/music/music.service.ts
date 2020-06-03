import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MusicEntity} from "./music.entity";
import {MusicDTO} from "./music.dto";



@Injectable()
export class MusicService {

    constructor(
        @InjectRepository(MusicEntity)
        private musicEntityRepository: Repository<MusicEntity>,
    ) {}

    

    async create(musicDTO:MusicDTO){
        let music = await this.musicEntityRepository.findOne({where:{name:musicDTO.name}});
        if(music) {
            throw new HttpException('A music with this name already exist', HttpStatus.CONFLICT);
        }
        music = await this.musicEntityRepository.create(musicDTO);
        await this.musicEntityRepository.save(music);
        return music.toResponseObject();
    }

    async findAll(){
        let musics:MusicEntity[] = await this.musicEntityRepository.find();
        musics.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, musics);
        return musics;
    }

    async delete(id) {

    }


    async findById(musicId:string){
        let music = await this.musicEntityRepository.findOne({where:{id:musicId}});
        if(!music){
            throw new HttpException('Music not found', HttpStatus.NOT_FOUND);
        }
        return music;
    }

}
