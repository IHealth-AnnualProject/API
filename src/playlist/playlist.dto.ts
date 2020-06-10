import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {MusicEntity} from "../music/music.entity";
import {UserEntity} from "../user/user.entity";
import {MusicRO} from "../music/music.dto";


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
    name: string;
    @ApiPropertyOptional()
    musics: MusicEntity[];
    @ApiPropertyOptional()
    user:UserEntity;
}

export class PlaylistCreation {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    musics: string[];
}