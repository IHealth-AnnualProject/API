import {Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards} from '@nestjs/common';

import { AuthService } from './auth.service';
import {UserService} from "../user/user.service";
import {UserAndTokenResponse, UserDTO} from "../user/user.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {UserProfileDTO} from "../userProfile/userProfile.dto";
import {UserLogin} from "./auth.validation";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import { TokenValidResponse} from "./auth.response";

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @ApiCreatedResponse({
        description: 'Users login.',
        type: UserAndTokenResponse,
    })
    @Post('login')
    async login(@Body() userLogin: UserLogin) {
        const user = await this.userService.login(userLogin);
        const token = await this.authService.login(user);
        return { user, token };
    }


    @Post('register')
    async register(@Body() userDTO: UserDTO) {
        if(userDTO.username===undefined || userDTO.password===undefined){
            throw new HttpException('Missing argument password or username', HttpStatus.BAD_REQUEST);
        }
        await this.userService.register(userDTO);
    }

    @ApiCreatedResponse({
        description: 'Users login.',
        type: TokenValidResponse,
    })
    @UseGuards(JwtAuthGuard)
    @Get('is-token-valid')
    async isTokenValid(@User() user) {
        return {user:user,statusCode:200}
    }
}