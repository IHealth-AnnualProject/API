import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {MusicRO} from "../music/music.dto";
import {MusicEntity} from "../music/music.entity";
import {IsNotEmpty} from "class-validator";


export class PlaylistRO {
    @ApiPropertyOptional()
    id: string;
    @ApiPropertyOptional()
    name: string;
    @ApiPropertyOptional()
    musics: MusicRO[];
}

export class PlaylistDTO {
    @ApiPropertyOptional()
    name;
    @ApiPropertyOptional()
    musics;
    @ApiPropertyOptional()
    user;
}

export class PlaylistModify {
    @ApiPropertyOptional()
    name: string;
    @ApiPropertyOptional()
    musics: MusicEntity[];
}

export class PlaylistCreation {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    musics: string[];
}