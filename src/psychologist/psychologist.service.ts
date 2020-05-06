import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

import {UserEntity} from "../user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MoralStatsEntity} from "../moral_stats/moralStats.entity";
import {MoralStatsService} from "../moral_stats/moralStats.service";
import {PsychologistEntity} from "./psychologist.entity";
import {PsychologistDTO, PsychologistDTOID} from "./psychologist.dto";


@Injectable()
export class PsychologistService {

    constructor(
        @InjectRepository(PsychologistEntity)
        private userProfileEntityRepository: Repository<PsychologistEntity>,
    ) {}


    async read(id:number){
        let user = await this.userProfileEntityRepository.findOne({where:{id:id}, relations: ["user"]});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }

    async create(psychologistDTO:PsychologistDTOID){
        let psychologist = await this.userProfileEntityRepository.findOne({where:{id:psychologistDTO.id}});
        if(psychologist) {
            throw new HttpException('User have already a profile.', HttpStatus.CONFLICT);
        }
        psychologist = await this.userProfileEntityRepository.create(psychologistDTO);
        await this.userProfileEntityRepository.save(psychologist);
        return psychologist.toResponseObject();
    }

    async update(psychologistDTO: PsychologistDTO) {
        let psychologist = await this.userProfileEntityRepository.findOne({where:{user:psychologistDTO.user}});
        if(!psychologist){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        await this.userProfileEntityRepository.update(psychologist.id, psychologistDTO);
        psychologist =await this.userProfileEntityRepository.findOne({where:{user:psychologistDTO.user}});
        return psychologist.toResponseObject();
    }

    async findAll(){
         let users = await this.userProfileEntityRepository.find({ relations: ["user"]});
         users.forEach(function(part, index) {
                this[index] = part.toResponseObject();
            }, users);
        return users;
    }

    async findByUserId(userId:string){
        let user = await this.userProfileEntityRepository.findOne({where:{user:userId}});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }
}
