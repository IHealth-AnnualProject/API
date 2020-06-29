
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserProfileModule} from "../userProfile/userProfile.module";
import {FriendsModule} from "../friends/friends.module";
import {PsychologistController} from "../psychologist/psychologist.controller";
import {UserController} from "./user.controller";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),FriendsModule],
    providers: [UserService],
    controllers:[UserController],
    exports: [UserService],
})
export class UserModule {}