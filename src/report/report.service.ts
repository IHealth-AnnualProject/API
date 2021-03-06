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
            throw new HttpException('No report found on this user', HttpStatus.NOT_FOUND);
        }

        report.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, report);

        return report;
    }


    async getLast(){
        let report = await this.reportEntityRepository.find({order:{created:"DESC"},relations:["to","from"]});
        if(report.length===0){
            throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
        }
        console.log()
        if(report[0]){
            return report[0].toResponseObject();
        }
        return report[0];
    }

    async getReportByID(reportId:string){
      let report = await this.reportEntityRepository.findOne({where:{id:reportId},relations:["to","from"]});
      if(!report){
        throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
      }
      return report.toResponseObject();
    }


    async banUser(reportId:string){
        let report = await this.reportEntityRepository.findOne({where:{id:reportId},relations:["to","from"]});
        if(!report){
            throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
        }
        await this.userService.ban(report.to.id);
        report.isResolve=true;
        return await this.reportEntityRepository.update(reportId,report);
    }

    async forgiveUser(reportId:string){
        let report = await this.reportEntityRepository.findOne({where:{id:reportId},relations:["to","from"]});
        if(!report){
            throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
        }
        report.isResolve=true;
        await this.userService.forgive(report.to.id);
        return await this.reportEntityRepository.update(reportId,report);
    }


    async seen(reportId:string){
        let report = await this.reportEntityRepository.findOne({where:{id:reportId},relations:["to","from"]});
        if(!report){
            throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
        }
        report.isResolve=true;
        return await this.reportEntityRepository.update(reportId,report);
    }

}
