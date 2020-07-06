import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {ReportEntity} from "./report.entity";
import {ReportCreation} from "./report.validation";
import {ReportDTO} from "./report.dto";
import { UserEntity } from '../user/user.entity';


export class ReportService {
    constructor(
        @InjectRepository(ReportEntity)
        private reportEntityRepository: Repository<ReportEntity>,
        private userService:UserService,
    ) {}

    async create(reportCreation:ReportCreation,userid:string){
        let report = await this.reportEntityRepository.findOne({where:{from:userid,to:reportCreation.reportedUser}});
        if(report) {
            throw new HttpException('A report with this name already exist', HttpStatus.CONFLICT);
        }
        let user = await this.userService.findOneById(reportCreation.reportedUser);
        if(!user){
          throw new HttpException('THe user you trying to report doesnt exist', HttpStatus.BAD_REQUEST);

        }
        let reportDto:ReportDTO={name:reportCreation.name,description:reportCreation.description,from:userid,to:reportCreation.reportedUser};
        let reportCreate = await this.reportEntityRepository.create(reportDto);
        return await this.reportEntityRepository.save(reportCreate);
    }

    async findAll(){
        let reports:ReportEntity[] = await this.reportEntityRepository.find({relations:["to","from"]});
        reports.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, reports);
        return reports;
    }

    async delete(reportId:string){
        return await this.reportEntityRepository.delete(reportId);
    }

    async findReportOnUser(reportedUserid:string){
        let report = await this.reportEntityRepository.find({where:{to:reportedUserid},relations:["to","from"]});
        if(!report){
            throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
        }
        return report;
    }


    async getLast(){
        let error = await this.reportEntityRepository.find({order:{created:"DESC"}});
        if(!error){
            throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
        }
        return error[0];
    }



}
