
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {UserModule} from "../user/user.module";
import {UserEntity} from "../user/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {MoralStatsModule} from "../moral_stats/moralStats.module";
import {PsychologistService} from "./psychologist.service";
import {PsychologistController} from "./psychologist.controller";
import {PsychologistEntity} from "./psychologist.entity";


@Module({
    imports: [TypeOrmModule.forFeature([PsychologistEntity]),AuthModule],
    providers: [PsychologistService],
    controllers:[PsychologistController],
    exports: [PsychologistService],
})
export class PsychologistModule {}