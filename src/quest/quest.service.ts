import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Difficulty, QuestEntity} from "./quest.entity";
import {QuestDTO} from "./quest.dto";
import {QuestCreation} from "./quest.validation";
import {QuestValidationDTO, QuestValidationEntity} from "./questValidation.entity";
import {UserService} from "../user/user.service";



@Injectable()
export class QuestService {

    constructor(
        @InjectRepository(QuestEntity)
        private questEntityRepository: Repository<QuestEntity>,
        @InjectRepository(QuestValidationEntity)
        private questValidationRepository:Repository<QuestValidationEntity>,
        private userService:UserService
    ) {}

    /*
    async read(id:number){
        let user = await this.questEntityRepository.findOne({where:{id:id}, relations: ["user"]});
        if(!user){
            throw new HttpException('profile not found', HttpStatus.NOT_FOUND);
        }
        return user.toResponseObject();
    }*/

    async create(questDTO:QuestCreation){
        let quest = await this.questEntityRepository.findOne({where:{name:questDTO.name}});
        if(quest) {
            throw new HttpException('A quest with this name already exist', HttpStatus.CONFLICT);
        }
        quest = await this.questEntityRepository.create(questDTO);
        await this.questEntityRepository.save(quest);
        return quest.toResponseObject();
    }
    /*
    async update(questDTO: QuestDTO,questID:string) {
        let quest = await this.questEntityRepository.findOne({where:{id:questID}});
        if(!quest){
            throw new HttpException('quest not found', HttpStatus.NOT_FOUND);
        }
        await this.questEntityRepository.update(quest.id, questDTO);
        quest =await this.questEntityRepository.findOne({where:{id:questID}});
        return quest.toResponseObject();
    }*/

    async findAll(){
        let quests:QuestEntity[] = await this.questEntityRepository.find();
        quests.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, quests);
        return quests;
    }

    async delete(id) {

    }

    async isQuestDone(userId: string, questid: string){
        let quest:QuestValidationEntity[] = await this.questValidationRepository.find({where:{user:userId,quest:questid}});
        return quest.length !== 0;
    }

    async questDone(userId: string){
        return await this.questValidationRepository.find({where:{user:userId}});
    }

    async findById(questId:string){
        let quest = await this.questEntityRepository.findOne({where:{id:questId}});
        if(!quest){
            throw new HttpException('Quest not found', HttpStatus.NOT_FOUND);
        }
        return quest;
    }

    async validate(userId: string, questid: string) {
        let xp:number;
        let quest:QuestEntity = await this.findById(questid);
        if(await this.isQuestDone(userId,questid)){
            throw new HttpException('Quest already done', HttpStatus.CONFLICT);
        }
        let questValidDTO:QuestValidationDTO = {user:userId,quest:questid};
        let questValid = await this.questValidationRepository.create(questValidDTO);
        await this.questValidationRepository.save(questValid);
        switch(quest.difficulty){
            case Difficulty.EASY:{
                xp =10;
                break;
            }
            case Difficulty.MEDIUM:{
                xp =30;
                break;
            }
            case Difficulty.HARD:{
                xp =50;
                break;
            }
            default:
            {
                xp=0;
                break;
            }
        }
        await this.userService.addXP(userId,xp);
        return;
    }
}
