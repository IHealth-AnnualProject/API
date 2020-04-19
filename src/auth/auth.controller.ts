import {Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards} from '@nestjs/common';

import { AuthService } from './auth.service';
import {UserService} from "../user/user.service";
import {UserAndTokenResponse, UserDTO} from "../user/user.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {UserProfileDTO} from "../userProfile/userProfile.dto";

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
    async login(@Body() userDTO: UserDTO) {
        const user = await this.userService.login(userDTO);
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
}