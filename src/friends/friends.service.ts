import {InjectRepository} from "@nestjs/typeorm";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {FriendsEntity} from "./friends.entity";
import {UserProfileEntity} from "../userProfile/userProfile.entity";
import {UserDTO} from "../user/user.dto";


@Injectable()
export class FriendsService {
    constructor(@InjectRepository(FriendsEntity)
                private friendRepository: Repository<FriendsEntity>) {}

        async addFriend(userProfile:UserDTO,friendsProfile:UserDTO) {
        let addMyFriend = await this.friendRepository.create({friend:friendsProfile,user:userProfile});
        let AddMeAsFriend = await this.friendRepository.create({friend:userProfile,user:friendsProfile});
        await this.friendRepository.save(addMyFriend);
        await this.friendRepository.save(AddMeAsFriend);
    }
    async getFriends(userId:string){
        let res;
        let friends = await this.friendRepository.find({where:{user:userId},relations:["friend"]});
        if(!friends){
            throw new HttpException('No data found for this user', HttpStatus.NOT_FOUND);
        }
        res = friends.map((element)=>{
            return {id:element.friend.id,username:element.friend.username};
        });
        return res;
    }
}