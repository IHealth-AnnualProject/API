import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {PsychologistRO} from "../psychologist/psychologist.dto";
import {QuestRO} from "./quest.dto";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";

export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}

@Entity('quest')
export class QuestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({
        type: "enum",
        enum: Difficulty,
        default: Difficulty.EASY
    })
    difficulty: Difficulty;

    @Column('text',{
        default: ''
    })
    description:string;

    toResponseObject(): QuestRO {
        return {description:this.description,id:this.id,name:this.name,difficulty:this.difficulty};
    }
}