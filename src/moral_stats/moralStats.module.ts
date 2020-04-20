
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {UserModule} from "../user/user.module";
import {UserEntity} from "../user/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {MoralStatsEntity} from "./moralStats.entity";
import {MoralStatsService} from "./moralStats.service";


@Module({
    imports: [TypeOrmModule.forFeature([MoralStatsEntity])],
    providers: [MoralStatsService],
    controllers:[],
    exports: [MoralStatsService],
})
export class MoralStatsModule {}