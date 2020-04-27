
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PsychologistEntity} from "./psychologist.entity";
import {PsychologistService} from "./psychologist.service";
import {PsychologistController} from "./psychologist.controller";



@Module({
    imports: [TypeOrmModule.forFeature([PsychologistEntity])],
    providers: [PsychologistService],
    controllers:[PsychologistController],
    exports: [PsychologistService],
})
export class PsychologistModule {}