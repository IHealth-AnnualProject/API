import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class MusicRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    name:string;
    @ApiPropertyOptional()
    duration:number;
    @ApiPropertyOptional()
    linkDownload:string;

}

export class MusicDTO {
    name:string;
    duration:number;
    filename:string;
}

export class MusicCreation {
    @ApiProperty()
    @IsNotEmpty()
    name:string;
}

export class FileDTO{
    @ApiProperty()
    @IsNotEmpty()
    file:any;

    @ApiProperty()
    @IsNotEmpty()
    path:any;
}