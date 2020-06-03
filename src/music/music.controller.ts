import {MusicService} from "./music.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {
    Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {FileDTO, MusicCreation, MusicDTO, MusicRO} from "./music.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {QuestCreation} from "../quest/quest.validation";
import { diskStorage } from  'multer';
import { extname } from "path";
import {PsychologistDTO} from "../psychologist/psychologist.dto";
let fs = require('fs');
const FileType = require('file-type');

const { getAudioDurationInSeconds } = require('get-audio-duration');

export const localStorageFileInterceptor = (fileName: string) => FileInterceptor(fileName,
    {
        storage: diskStorage({
            destination: './song',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => (Math.round(Math.random() * 16)).toString(16))
                    .join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    });

@Controller('music')
@ApiTags('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: [MusicRO] })
    async read() {
        return await this.musicService.findAll();
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(localStorageFileInterceptor('file'))
    async create(@UploadedFile() file:FileDTO,@Body() musicCreation:MusicCreation) {
        let file_duration;
        if(!musicCreation.name){
            throw new HttpException('Please specify a name for the song', HttpStatus.BAD_REQUEST);
        }
        let isMp3 = await this.checkIfMp3(file);
        if(isMp3){
            await getAudioDurationInSeconds(file.path).then((duration) => {
                file_duration =duration;
            });
            let music:MusicDTO = {name:musicCreation.name,duration:file_duration,filename:file.path};
            return await this.musicService.create(music);
        }else{
            fs.unlinkSync(file.path);
            throw new HttpException('The given file is not an audio file', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async delete(@Param() param,@User() user,) {
        return await this.musicService.delete(param.id);
    }

    async checkIfMp3(file){
            let filetype = await FileType.fromFile(file.path);
            if(!filetype){
                return false;
            }
            let count = (filetype.mime.match(/audio/g) || []).length;
            return count => 1;
    }
}
