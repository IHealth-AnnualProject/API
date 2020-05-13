import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {MessageEntity} from "./message.entity";
import {Repository} from "typeorm";
import {MessageDTO} from "./message.dto";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";

@Injectable()
export class MessageService {
    constructor(@InjectRepository(MessageEntity)
                private messageEntityRepository: Repository<MessageEntity>) {}

                async create(messageDTO:MessageDTO){
                    let message = this.messageEntityRepository.create(messageDTO);
                    return await this.messageEntityRepository.save(message);
                }
                async getConversation(userID:string){
                     let conversations:MessageEntity[] = await this.messageEntityRepository.find({where:[{to:userID,state:FriendRequestState.ACCEPT},{from:userID,state:FriendRequestState.ACCEPT}],relations:["from","to"]});
                     let id = [];
                     let res = [];
                     conversations.forEach(function(element){
                         if(id.includes(element.from.id)===false && userID !== element.from.id ){
                             id.push(element.from.id);
                             res.push(element.from.toResponseObject());
                             return;
                         }
                         if(id.includes(element.to.id)===false && userID !== element.to.id){
                             id.push(element.to.id);
                             res.push(element.to.toResponseObject());
                             return;
                         }
                     });
                    return res ;
                }

    async getConversationMessage(me: string,user:string) {
        let messages:MessageEntity[] =  await this.messageEntityRepository.find({where:[{to:me,from:user,state:FriendRequestState.ACCEPT},
                {to:user,from:me,state:FriendRequestState.ACCEPT}],relations:["from","to"],order:{created:"ASC"}});
        messages.forEach(function(part, index) {
            this[index] = part.toResponseObject();
        }, messages);
        return messages;
    }
}