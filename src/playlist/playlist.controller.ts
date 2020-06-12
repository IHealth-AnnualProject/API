import {PlaylistService} from "./playlist.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {
    Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {QuestCreation} from "../quest/quest.validation";
import { diskStorage } from  'multer';
import { extname } from "path";
import {PsychologistDTO} from "../psychologist/psychologist.dto";
import {PlaylistEntity} from "./playlist.entity";
import {PlaylistCreation, PlaylistRO} from "./playlist.dto";
import {MusicRO} from "../music/music.dto";
let fs = require('fs');
const FileType = require('file-type');

const { getAudioDurationInSeconds } = require('get-audio-duration');

@Controller('playlist')
@ApiTags('playlist')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}
    @Post(':playlistId/addMusic/:idMusic')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async addMusic(@Param('playlistId') playlistId,@Param('idMusic') musicId,@User() user) {
        console.log("heho");
        return await this.playlistService.addMusic(playlistId,musicId,user.userId);
    }

    @Get(':playlistId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: PlaylistRO})
    async findById(@Param('playlistId') playlistId) {
        let Playlist:PlaylistEntity = await this.playlistService.findById(playlistId);
        return Playlist.toResponseObject();
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: [PlaylistRO]})
    async findAll(@User() user) {
        return await this.playlistService.findAll(user.userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async create(@Body() playlist:PlaylistCreation,@User() user) {
        return await this.playlistService.create(playlist,user.userId);
    }




}
