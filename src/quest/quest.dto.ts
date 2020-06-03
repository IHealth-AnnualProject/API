import {FriendRequestState} from "../friendRequest/friendRequest.entity";
import {Difficulty} from "./quest.entity";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class QuestRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    name:string;
    @ApiPropertyOptional()
    difficulty:Difficulty;
    @ApiPropertyOptional()
    description:string;

}

export class QuestDTO {
    id:string;
    name:string;
    difficulty:Difficulty;
    description:string;

}