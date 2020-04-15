
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {UserModule} from "../user/user.module";
import {UserProfileService} from "./userProfile.service";
import {UserProfileController} from "./userProfile.controller";
import {UserEntity} from "../user/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {UserProfileEntity} from "./userProfile.entity";


@Module({
    imports: [TypeOrmModule.forFeature([UserProfileEntity]),AuthModule
    ],
    providers: [UserProfileService],
    controllers:[UserProfileController],
    exports: [UserProfileService],
})
export class UserProfileModule {}