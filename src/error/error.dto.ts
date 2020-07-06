import {ApiPropertyOptional} from "@nestjs/swagger";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";

export enum ErrorState {
    PENDING = "PENDING",
    RESOLVE = "RESOLVE",
}

export class ErrorRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    name:string;
    @ApiPropertyOptional()
    description:string;
    @ApiPropertyOptional()
    state:ErrorState;
    @ApiPropertyOptional()
    created:Date;
}

export class ErrorDTO {
    id:string;
    name:string;
    description:string;
}