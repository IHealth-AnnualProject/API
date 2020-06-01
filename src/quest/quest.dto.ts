import {FriendRequestState} from "../friendRequest/friendRequest.entity";
import {Difficulty} from "./quest.entity";

export class QuestRO {
    id:string;
    name:string;
    difficulty:Difficulty;
    description:string;

}

export class QuestDTO {
    id:string;
    name:string;
    difficulty:Difficulty;
    description:string;

}