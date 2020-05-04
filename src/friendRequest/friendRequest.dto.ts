import {ApiProperty} from "@nestjs/swagger";
import {FriendRequestState} from "./friendRequest.entity";


export class FriendRequestDTO {

    from;

    to;

    state:FriendRequestState;
}
