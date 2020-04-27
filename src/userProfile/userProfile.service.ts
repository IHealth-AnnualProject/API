import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {UserProfileDTO} from "./userProfile.dto";
import {UserEntity} from "../user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserProfileEntity} from "./userProfile.entity";
import {MoralStatsEntity} from "../moral_stats/moralStats.entity";
import {MoralStatsService} from "../moral_stats/moralStats.service";


@Injectable()
export class UserProfileService {

    constructor(
        @InjectRepository(UserProfileEntity)
        private userProfileEntityRepository: Repository<UserProfileEntity>,
        private moralStatsService:MoralStatsService,
    ) {}

    async getMoralStats(userProfileId:string){
        return await this.moralStatsService.getMoralStats(userProfileId);
    }

    async read(id:string){
        let user = await this.userProfileEntityRepository.findOne({where:{id:id}});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }
    async create(userId:UserProfileDTO){
        let userProfile = await this.userProfileEntityRepository.findOne({where:{user:userId.user}});
        if(userProfile) {
            throw new HttpException('User have already a profile.', HttpStatus.CONFLICT);
        }
        userProfile = await this.userProfileEntityRepository.create(userId);
        await this.userProfileEntityRepository.save(userProfile);
        return userProfile.toResponseObject();
    }

    async update(userProfileDTO: UserProfileDTO) {
        let userProfile = await this.userProfileEntityRepository.findOne({where:{user:userProfileDTO.user}});
        if(!userProfile){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        await this.userProfileEntityRepository.update(userProfile.id, userProfileDTO);
        userProfile =await this.userProfileEntityRepository.findOne({where:{user:userProfileDTO.user}});
        return userProfile.toResponseObject();
    }

    async findAll(){
         let users = await this.userProfileEntityRepository.find();
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

    async addMoralStat(userId: string , value: number) {
        let user = await this.userProfileEntityRepository.findOne({where:{user:userId}});
        return await this.moralStatsService.addMoralStat(user,value)
    }
}
