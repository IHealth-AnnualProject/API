import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import {UserLogin} from "../auth/auth.validation";
import {UserProfileService} from "../userProfile/userProfile.service";
import {UserProfileDTO} from "../userProfile/userProfile.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async login(data: UserLogin) {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST,
            );
        }
        return user.toResponseObject();
    }

    async register(data: UserDTO) {
        // TODOOO CREER LE PROFILE ICI
        const { username } = data;
        let user = await this.userRepository.findOne({where: { username }});
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        /*
        if(!user.isPsy){
            let userProfileDto:UserProfileDTO;
            userProfileDto.user=user.id;
            this.userProfileService.create(userProfileDto);
        }*/
        return user ;
    }

    async findOne(username: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({ where: { username } });
    }

}