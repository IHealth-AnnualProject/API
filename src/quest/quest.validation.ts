import {Difficulty} from "./quest.entity";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class QuestCreation {
    @ApiProperty()
    @IsNotEmpty()
    name:string;
    @ApiProperty()
    @IsNotEmpty()
    difficulty:Difficulty;
    @ApiProperty()
    @IsNotEmpty()
    description:string;
}