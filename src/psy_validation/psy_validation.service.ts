import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { PsyValidationEntity } from './psy_validation.entity';
import { PsyValidationDto } from './psy_validation.dto';
import { HttpException, HttpStatus } from '@nestjs/common';


export class PsyValidationService {
    constructor(
        @InjectRepository(PsyValidationEntity)
        private psyValidationEntityRepository: Repository<PsyValidationEntity>,
    ) {}

  async findById(id:string){
    let psyValidationEntity = await this.psyValidationEntityRepository.findOne({where:{id:id}});
    if(!psyValidationEntity){
      throw new HttpException('PsyValidation not found', HttpStatus.NOT_FOUND);
    }
    return psyValidationEntity;
  }

    async create(psyValidationDTO:PsyValidationDto){
        let psyValidation = await this.psyValidationEntityRepository.create(psyValidationDTO);
        return await this.psyValidationEntityRepository.save(psyValidation);
    }

    async findAll(){
        let errors:PsyValidationEntity[] = await this.psyValidationEntityRepository.find();
        errors.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, errors);
        return errors;
    }

    async delete(errorId:string){
        return await this.psyValidationEntityRepository.delete(errorId);
    }

    async getLast(){
        let error = await this.psyValidationEntityRepository.find({order:{created:"DESC"}});
        if(!error){
            throw new HttpException('Error not found', HttpStatus.NOT_FOUND);
        }
        return error[0];
    }


}
