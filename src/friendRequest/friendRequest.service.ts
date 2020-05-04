import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {UserProfileEntity} from "../userProfile/userProfile.entity";
import {FriendRequestEntity, FriendRequestState} from "./friendRequest.entity";
import {FriendRequestDTO} from "./friendRequest.dto";
import {UserEntity} from "../user/user.entity";
import {UserService} from "../user/user.service";
import {UserProfileService} from "../userProfile/userProfile.service";


@Injectable()
export class FriendRequestService {
    constructor(@InjectRepository(FriendRequestEntity)
                private friendRequestRepository: Repository<FriendRequestEntity>,
                private userProfileService:UserService
                ) {}

    async addFriend(yourId:string,userId:string){
        if( !userId){
             throw new HttpException('No user id given', HttpStatus.BAD_REQUEST);
        }
        if(userId===yourId){
            throw new HttpException('You cannot add yourself as a friend :)', HttpStatus.BAD_REQUEST);
        }
        let user = this.userProfileService.findOne(userId);//by id
        if(!user){
            throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
        }
        let friendRequestDTO:FriendRequestDTO={from:yourId,to:userId,state:FriendRequestState.PENDING};
        let friendRequest =this.friendRequestRepository.create(friendRequestDTO);
        await this.friendRequestRepository.save(friendRequest);
    }

    async acceptFriendRequest(requestId,yourId){

        let friendRequest:FriendRequestEntity = await this.friendRequestRepository.findOne({where:{id:requestId},relations:["to","from"]});
        if(!friendRequest){
            throw new HttpException('request not found', HttpStatus.NOT_FOUND);
        }
        if(friendRequest.to.id!==yourId){
            throw new HttpException('You cannot accept this request', HttpStatus.UNAUTHORIZED);
        }

        friendRequest.state = FriendRequestState.ACCEPT;
        await this.userProfileService.addFriend(yourId,friendRequest.from.id);
        return await this.friendRequestRepository.update(friendRequest.id,friendRequest);
    }

    async denyFriendRequest(requestId,yourId){
        let friendRequest:FriendRequestEntity = await this.friendRequestRepository.findOne({where:{id:requestId}});
        if(!friendRequest){
            throw new HttpException('request not found', HttpStatus.NOT_FOUND);
        }
        if(friendRequest.to!==yourId){
            throw new HttpException('You cannot accept this request', HttpStatus.UNAUTHORIZED);
        }
        friendRequest.state = FriendRequestState.DENIED;
        return await this.friendRequestRepository.update(friendRequest.id,friendRequest);
    }

    async getMyFriend(yourId){
        return await this.friendRequestRepository.find({where:[{to:yourId,state:FriendRequestState.ACCEPT},{from:yourId,state:FriendRequestState.ACCEPT}],relations:["from","to"]});
    }

    async getMyFriendRequest(yourId){
        return await this.friendRequestRepository.find({where:[{to:yourId},{from:yourId,state:FriendRequestState.ACCEPT}]});
    }

    async getMyPendingFriendRequest(yourId){
        return await this.friendRequestRepository.find({where:{to:yourId,state:FriendRequestState.PENDING},relations:["from"]});
    }

}