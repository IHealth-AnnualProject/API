import {
    Body, Controller, HttpException, HttpStatus, Request, Post, UseGuards, Patch, Get,
    HttpCode, Param
} from "@nestjs/common";
import {UserDTO} from "../user/user.dto";
import {UserService} from "../user/user.service";
import {AuthService} from "../auth/auth.service";
import {UserProfileDTO} from "./userProfile.dto";
import {UserProfileService} from "./userProfile.service";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import * as Path from "path";

@Controller('userProfile')
export class UserProfileController {
    constructor(
        private userProfileService: UserProfileService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@User() user,@Body() patientDto:UserProfileDTO) {
        patientDto.user = user.userId;
        return await this.userProfileService.create(patientDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async read(@User() user) {
        return await this.userProfileService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param() param) {
        console.log(param.id);
        return await this.userProfileService.read(param.id);
    }


    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(204)
    async update(@User() user,@Body() patientDto:UserProfileDTO){
        patientDto.user = user.userId;
        return await this.userProfileService.update(patientDto);
    }

}