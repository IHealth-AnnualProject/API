import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class MoralStatCreation {
    @ApiProperty()
    @IsNotEmpty()
    value: number;
}