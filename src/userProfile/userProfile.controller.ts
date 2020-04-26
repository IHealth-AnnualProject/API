import {
    Body, Controller, HttpException, HttpStatus, Request, Post, UseGuards, Patch, Get,
    HttpCode, Param
} from "@nestjs/common";
import {UserProfileDTO, UserProfileRO} from "./userProfile.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ApiTags, ApiCreatedResponse, ApiBody} from "@nestjs/swagger";
import {UserProfileService} from "./userProfile.service";
import {ApiImplicitBody} from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";


@ApiTags('userProfile')
@Controller('userProfile')
export class UserProfileController {
    constructor(
        private userProfileService: UserProfileService,
    ) {}

    //You cant create userProfile as a psy
    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@User() user,@Body() patientDto:UserProfileDTO)
    {
        if(!user.isPsy) {
            patientDto.user = user.userId;
            return await this.userProfileService.create(patientDto);
        }
        throw new HttpException('You cant create userProfile as a psy', HttpStatus.UNAUTHORIZED);    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: [UserProfileDTO],
    })
    async read(@User() user) {
        return await this.userProfileService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param() param) {
        return await this.userProfileService.read(param.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-profile')
    async findMyProfile(@User() user) {
        return await this.userProfileService.read(user.userId);
    }


    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(204)
    async update(@User() user,@Body() patientDto:UserProfileDTO)
    {
        patientDto.user = user.userId;
        return await this.userProfileService.update(patientDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('moral-stats')
    async addMoralStat(@User() user,@Body('value') value:number){
        //TODO restrictions par jour
        return await this.userProfileService.addMoralStat(user.userId,value);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/moral-stats')
    async getMoralStats(@Param() param)
    {
        //TODO sécuriser si les utilisateurs ne sont pas lié / amis
        return await this.userProfileService.getMoralStats(param.userId)
    }
}