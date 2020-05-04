import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {UserProfileDTO, UserProfileDTOID} from "./userProfile.dto";
import {UserEntity} from "../user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserProfileEntity} from "./userProfile.entity";
import {MoralStatsEntity} from "../moral_stats/moralStats.entity";
import {MoralStatsService} from "../moral_stats/moralStats.service";
import {FriendsService} from "../friends/friends.service";
import {UserService} from "../user/user.service";


@Injectable()
export class UserProfileService {

    constructor(
        @InjectRepository(UserProfileEntity)
        private userProfileEntityRepository: Repository<UserProfileEntity>,
        private moralStatsService:MoralStatsService,
        private friendsService:FriendsService
    ) {}

    async getMoralStats(userProfileId:string){
        return await this.moralStatsService.getMoralStats(userProfileId);
    }

    async read(id:string){
        let user = await this.userProfileEntityRepository.findOne({where:{id:id} , relations: ["user"]});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }
    async create(userProfileDto:UserProfileDTOID){
        let userProfile = await this.userProfileEntityRepository.findOne({where:{user:userProfileDto.user}, relations: ["user"]});
        if(userProfile) {
            throw new HttpException('User have already a profile.', HttpStatus.CONFLICT);
        }
        userProfile = await this.userProfileEntityRepository.create(userProfileDto);
        await this.userProfileEntityRepository.save(userProfile);
        return userProfile.toResponseObject();
    }

    async update(userProfileDTO: UserProfileDTO) {
        let userProfile = await this.userProfileEntityRepository.findOne({where:{user:userProfileDTO.user}, relations: ["user"]});
        if(!userProfile){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        await this.userProfileEntityRepository.update(userProfile.id, userProfileDTO);
        userProfile =await this.userProfileEntityRepository.findOne({where:{user:userProfileDTO.user}});
        return userProfile.toResponseObject();
    }

    async findAll(){
         let users = await this.userProfileEntityRepository.find({ relations: ["user"]});
         users.forEach(function(part, index) {
                this[index] = part.toResponseObject();
            }, users);
        return users;
    }

    async findByUserId(userId:string){
        let user = await this.userProfileEntityRepository.findOne({where:{user:userId}, relations: ["user"]});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }

    async addMoralStat(userId: string , value: number) {
        let user = await this.userProfileEntityRepository.findOne({where:{user:userId} , relations: ["user"]});
        return await this.moralStatsService.addMoralStat(user,value)
    }

    async findOne(id: string): Promise<UserProfileEntity | undefined> {
        return await this.userProfileEntityRepository.findOne({ where: { id } });
    }

    async getFriend(id:string){
        return await this.friendsService.getFriends(id);
    }
}
