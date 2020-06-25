import {
    Body, Controller, HttpException, HttpStatus, Request, Post, UseGuards, Patch, Get,
    HttpCode, Param
} from "@nestjs/common";
import {UserProfileDTO, UserProfileRO} from "./userProfile.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ApiTags, ApiCreatedResponse, ApiBody} from "@nestjs/swagger";
import {UserProfileService} from "./userProfile.service";
import {MoralStatsDTO, MoralStatsRO} from "../moral_stats/moralStats.dto";
import {MoralStatCreation} from "./userProfile.validation";


@ApiTags('userProfile')
@Controller('userProfile')
export class UserProfileController {
    constructor(
        private userProfileService: UserProfileService,
    ) {}
    /*
    //You cant create userProfile as a psy
    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@User() user,@Body() patientDto:UserProfileDTO)
    {
        if(!user.isPsy) {
            patientDto.user = user.userId;
            return await this.userProfileService.create(patientDto);
        }
        throw new HttpException('You cant create userProfile as a psy', HttpStatus.UNAUTHORIZED);
    }*/

    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiCreatedResponse({
        type: [UserProfileRO],
    })
    async read(@User() user) {
        return await this.userProfileService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/user')
    @ApiCreatedResponse({
        type: UserProfileRO,
    })
    async findByIdUser(@Param() param) {
        return await this.userProfileService.findByUserId(param.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiCreatedResponse({
        type: UserProfileRO,
    })
    async findById(@Param() param) {
        return await this.userProfileService.read(param.id);
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
    async addMoralStat(@User() user,@Body() moral:MoralStatCreation){
        return await this.userProfileService.addMoralStat(user.userId,moral.value);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userProfileId/moral-stats')
    @ApiCreatedResponse({
        type: [MoralStatsRO],
    })
    async getMoralStats(@Param() param)
    {
        //TODO sécuriser si les utilisateurs ne sont pas lié / amis
        return await this.userProfileService.getMoralStats(param.userProfileId)
    }
    //TODO rajouter une verif sur l'user
    @UseGuards(JwtAuthGuard)
    @Get(':userProfileId/friends')
    async getFriend(@Param() param,@User() user)
    {
        return await this.userProfileService.getFriend(param.userProfileId);
    }

}