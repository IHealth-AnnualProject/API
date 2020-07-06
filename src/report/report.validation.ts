import { IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ReportCreation {
    @ApiProperty()
    @IsNotEmpty()
    name:string;
    @ApiProperty()
    @IsNotEmpty()
    description:string;
    @ApiProperty()
    @IsNotEmpty()
    reportedUser:string
}