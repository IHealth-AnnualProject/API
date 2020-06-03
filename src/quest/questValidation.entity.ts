import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {PsychologistRO} from "../psychologist/psychologist.dto";
import {QuestRO} from "./quest.dto";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";
import {UserEntity} from "../user/user.entity";
import {QuestEntity} from "./quest.entity";

@Entity('quest_validation')
export class QuestValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => QuestEntity)
    @JoinColumn()
    quest: QuestEntity;

}


export class QuestValidationDTO {

    quest;

    user;

}

