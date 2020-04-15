import {Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards} from '@nestjs/common';

import { AuthService } from './auth.service';
import {UserService} from "../user/user.service";
import {UserDTO} from "../user/user.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

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
        const user = await this.userService.register(userDTO);
        return { user}
    }
}