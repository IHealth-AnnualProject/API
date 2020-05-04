
import { Module } from '@nestjs/common';
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {FriendRequestService} from "./friendRequest.service";
import {FriendRequestEntity} from "./friendRequest.entity";
import {FriendRequestController} from "./friendRequest.controller";
import {UserProfileModule} from "../userProfile/userProfile.module";



@Module({
    imports: [TypeOrmModule.forFeature([FriendRequestEntity]),AuthModule,UserModule],
    providers: [FriendRequestService],
    controllers:[FriendRequestController],
    exports: [FriendRequestService],
})
export class FriendRequestModule {}