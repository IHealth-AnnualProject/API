import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MessageEntity} from "./message.entity";
import {Repository} from "typeorm";
import {MessageDTO} from "./message.dto";

@Injectable()
export class MessageService {
    constructor(@InjectRepository(MessageEntity)
                private messageEntityRepository: Repository<MessageEntity>) {}

                async create(messageDTO:MessageDTO){
                    let message = this.messageEntityRepository.create(messageDTO);
                    return await this.messageEntityRepository.save(message);
                }

}