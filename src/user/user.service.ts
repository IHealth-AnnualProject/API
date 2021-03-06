import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import {AdminCreation, UserCreation, UserDTO, UserModif} from './user.dto';
import {UserLogin} from "../auth/auth.validation";
import {UserProfileService} from "../userProfile/userProfile.service";
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {FriendsService} from "../friends/friends.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private friendsService:FriendsService,
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


    async register(data: UserCreation,psyRegister=false) {
        // TODOOO CREER LE PROFILE ICI
        const { username } = data;
        let user = await this.userRepository.findOne({where: { username }});
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        if(!psyRegister) {
          await this.userRepository.save(user);
        }
        return user ;
    }

    async registerAdmin(data: AdminCreation,psyRegister=false) {
        // TODOOO CREER LE PROFILE ICI
        const { username } = data;
        let user = await this.userRepository.findOne({where: { username }});
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        if(!psyRegister) {
            await this.userRepository.save(user);
        }
        return user ;
    }

    async findOne(username: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async findOneById(id: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async addFriend(userId:string,friendId:string){
        let me = await this.userRepository.findOne({where:{id:userId}});
        let friend = await this.userRepository.findOne({where:{id:friendId}});
        await this.friendsService.addFriend(me,friend);
    }

    async addXP(userId:string,xp:number){
        let user = await this.userRepository.findOne({where:{id:userId}});
        if(!user){
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        user.xp =user.xp+xp;
        await this.userRepository.update(user.id, user);
        return;
    }

    async update(userId:string,change:UserModif){
        let me = await this.userRepository.findOne({where:{id:userId}});
        me.skin=change.skin;
        await this.userRepository.update(userId, me);

    }

    async changePassword(userId:string,password:string){
        let me = await this.userRepository.findOne({where:{id:userId}});
        password = await bcrypt.hash(password, 10);
        me.password=password;
        return await this.userRepository.update(userId, me);
    }

    async delete(userID:string) {
        await this.userRepository.delete(userID);
    }

    async ban(userId:string){
        let me = await this.userRepository.findOne({where:{id:userId}});
        me.isBan=true;
        await this.userRepository.update(userId, me);
    }

    async forgive(userId:string){
        let me = await this.userRepository.findOne({where:{id:userId}});
        me.isBan=false;
        await this.userRepository.update(userId, me);
    }

    async findByUserName(username:string) :Promise<UserEntity | undefined>{
        return await this.userRepository.findOne({where:{username:username}});
    }
}