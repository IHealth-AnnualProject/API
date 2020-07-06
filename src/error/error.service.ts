import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {ErrorEntity} from "./error.entity";
import {ErrorState} from "./error.dto";


export class ErrorService {
    constructor(
        @InjectRepository(ErrorEntity)
        private errorEntityRepository: Repository<ErrorEntity>,
    ) {}

    /*
    async read(id:number){
        let user = await this.errorEntityRepository.findOne({where:{id:id}, relations: ["user"]});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }*/

    async create(errorDTO){
        let errorCreate = await this.errorEntityRepository.create(errorDTO);
        return await this.errorEntityRepository.save(errorCreate);
    }

    async findAll(){
        let errors:ErrorEntity[] = await this.errorEntityRepository.find();
        errors.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, errors);
        return errors;
    }

    async delete(errorId:string){
        return await this.errorEntityRepository.delete(errorId);
    }

    async findById(errorId:string){
        let error = await this.errorEntityRepository.findOne({where:{id:errorId}});
        if(!error){
            throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
        }
        return error;
    }


    async getLast(){
        let error = await this.errorEntityRepository.find({order:{created:"DESC"}});
        if(!error){
            throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
        }
        return error[0];
    }


   async validById(errorId: any) {
       let me = await this.errorEntityRepository.findOne({where:{id:errorId}});
       me.state=ErrorState.RESOLVE;
       await this.errorEntityRepository.update(errorId, me);
    }

    async pendingById(errorId: any) {
        let me = await this.errorEntityRepository.findOne({where:{id:errorId}});
        me.state=ErrorState.PENDING;
        await this.errorEntityRepository.update(errorId, me);
    }
}
