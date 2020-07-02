import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete, UseGuards, HttpCode,
} from '@nestjs/common';

import {UserService} from "./user.service";
import {addXp, UserDTO, UserModif} from "./user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {User} from "../decorator/user.decorator";
import {ApiTags} from "@nestjs/swagger";

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(204)
    async update(@User() user,@Body() patientDto:UserModif)
    {
        return await this.userService.update(user.userId,patientDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('addXp')
    async addXp(@User() user,@Body() xp:addXp)
    {
        return await this.userService.addXP(user.userId,xp.xp);
    }

}
