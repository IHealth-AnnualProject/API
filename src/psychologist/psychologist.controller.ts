import {
    Body, Controller, HttpException, HttpStatus, Request, Post, UseGuards, Patch, Get,
    HttpCode, Param
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ApiTags, ApiCreatedResponse, ApiBody} from "@nestjs/swagger";
import {ApiImplicitBody} from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import {PsychologistDTO} from "./psychologist.dto";
import {PsychologistService} from "./psychologist.service";
import {UserProfileDTO} from "../userProfile/userProfile.dto";



@ApiTags('psychologist')
@Controller('psychologist')
export class PsychologistController {
    constructor(
        private psychologistService: PsychologistService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@User() user,@Body() patientDto:PsychologistDTO)
    {

       if(user.isPsy){
        patientDto.user = user.userId;
        return await this.psychologistService.create(patientDto);
        }
        throw new HttpException('You are not a psy', HttpStatus.UNAUTHORIZED);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: [PsychologistDTO],
    })
    async read(@User() user) {
        return await this.psychologistService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param() param) {
        return await this.psychologistService.read(param.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(204)
    async update(@User() user,@Body() patientDto:PsychologistDTO)
    {
        patientDto.user = user.userId;
        return await this.psychologistService.update(patientDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/user')
    @ApiCreatedResponse({
        type: UserProfileDTO,
    })
    async findByIdUser(@Param() param) {
        return await this.psychologistService.findByUserId(param.id);
    }
}