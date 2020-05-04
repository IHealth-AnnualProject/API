import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {MoralStatsEntity} from "./moralStats.entity";
import {MoralStatsDTO} from "./moralStats.dto";
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {UserProfileEntity} from "../userProfile/userProfile.entity";

//TODO IL SE PEUT QUI IL EST UN PROBLEME DANS LES RELATIONS
@Injectable()
export class MoralStatsService {
    constructor(@InjectRepository(MoralStatsEntity)
                private moralStatsRepository: Repository<MoralStatsEntity>) {}

    async addMoralStat(userProfile:UserProfileEntity,value:number) {
        if(!userProfile){
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        if( value == undefined || value<0 || value>5){
            throw new HttpException('Error in request did you send a good value? ', HttpStatus.BAD_REQUEST);
        }
        let moralStatCreated = await this.moralStatsRepository.create({value:value,userProfile:userProfile});

        await this.moralStatsRepository.save(moralStatCreated);
        return;
    }

    async getMoralStats(userProfileId:string){
        let res = await this.moralStatsRepository.find({where:{userProfile:userProfileId}});
        if(!res){
            throw new HttpException('No data found for this user', HttpStatus.NOT_FOUND);
        }
        return res;
    }

}