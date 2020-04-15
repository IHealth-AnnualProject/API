import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {UserProfileDTO} from "./userProfile.dto";
import {UserEntity} from "../user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserProfileEntity} from "./userProfile.entity";


@Injectable()
export class UserProfileService {

    constructor(
        @InjectRepository(UserProfileEntity)
        private userProfileEntityRepository: Repository<UserProfileEntity>,
    ) {}

    async read(userId:number){
        let patient = await this.userProfileEntityRepository.findOne({where:{id:userId}});
        if(!patient){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return patient.toResponseObject();
    }
    async create(patientDTO:UserProfileDTO){
        let patient = await this.userProfileEntityRepository.findOne({where:{user:patientDTO.user}});
        if(patient) {
            throw new HttpException('User have already a profile.', HttpStatus.CONFLICT);
        }
        patient = await this.userProfileEntityRepository.create(patientDTO);
        await this.userProfileEntityRepository.save(patient);
        return patient.toResponseObject();
    }

    async update(patientDTO: UserProfileDTO) {
        let patient = await this.userProfileEntityRepository.findOne({where:{user:patientDTO.user}});
        if(!patient){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        await this.userProfileEntityRepository.update(patient.id, patientDTO);
        patient =await this.userProfileEntityRepository.findOne({where:{user:patientDTO.user}});
        return patient.toResponseObject();
    }

    async findAll(){
         let users = await this.userProfileEntityRepository.find();
         users.forEach(function(part, index) {
                this[index] = part.toResponseObject();
            }, users);
        return users;
    }
}
