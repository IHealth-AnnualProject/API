import {ApiProperty} from "@nestjs/swagger";
import {FriendRequestState} from "./FriendRequest.entity";


export class FriendRequestDTO {

    from;

    to;

    state:FriendRequestState;
}
