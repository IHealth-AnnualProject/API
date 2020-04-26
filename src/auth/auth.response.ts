import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class TokenValidResponse {
    @ApiProperty()
    userId:string;
    @ApiProperty()
    username:string;
    @ApiProperty()
    isPsy:boolean;
}