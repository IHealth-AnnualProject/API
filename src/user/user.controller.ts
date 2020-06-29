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
import {UserDTO, UserModif} from "./user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {User} from "../decorator/user.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Patch('')
    @HttpCode(204)
    async update(@User() user,@Body() patientDto:UserModif)
    {
        return await this.userService.update(user.userId,patientDto);
    }

}
