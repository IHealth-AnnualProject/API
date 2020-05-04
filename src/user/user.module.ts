
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserProfileModule} from "../userProfile/userProfile.module";
import {FriendsModule} from "../friends/friends.module";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),FriendsModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}