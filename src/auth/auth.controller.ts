import {Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards} from '@nestjs/common';

import { AuthService } from './auth.service';
import {UserService} from "../user/user.service";
import {UserAndTokenResponse, UserCreation, UserDTO} from "../user/user.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {UserProfileDTO, UserProfileDTOID} from "../userProfile/userProfile.dto";
import {UserLogin} from "./auth.validation";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import { TokenValidResponse} from "./auth.response";
import {UserProfileService} from "../userProfile/userProfile.service";
import {PsychologistService} from "../psychologist/psychologist.service";
import {PsychologistDTOID} from "../psychologist/psychologist.dto";
@Controller('auth')
export class AuthController {
    constructor(private userService: UserService,
                private authService: AuthService,
                private userProfileService: UserProfileService,
                private psychologistService: PsychologistService) {
    }

    @ApiCreatedResponse({
        description: 'Users login.',
        type: UserAndTokenResponse,
    })
    @Post('login')
    async login(@Body() userLogin: UserLogin) {
        const user = await this.userService.login(userLogin);
        const token = await this.authService.login(user);
        if (user.isPsy) {
            await this.psychologistService.findByUserId(user.id);
        } else {
            await this.userProfileService.findByUserId(user.id);
        }
        return {user, token};
    }


    @Post('register')
    async register(@Body() userDTO: UserCreation) {
        if (userDTO.username === undefined || userDTO.password === undefined ||userDTO.email ===undefined ) {
            throw new HttpException('Missing argument password username or email', HttpStatus.BAD_REQUEST);
        }
        let user = await this.userService.register(userDTO);
        if (!user.isPsy) {
            let userProfileDto: UserProfileDTOID = new UserProfileDTOID();
            userProfileDto.user = user.id;
            userProfileDto.id = user.id;
            userProfileDto.email = userDTO.email;
            return await this.userProfileService.create(userProfileDto);
        }
        let psychoID: PsychologistDTOID = new PsychologistDTOID();
        psychoID.user = user.id;
        psychoID.id = user.id;
        psychoID.first_name = "";
        psychoID.last_name = "";
        psychoID.email = userDTO.email;
        return await this.psychologistService.create(psychoID);

    }

    @ApiCreatedResponse({
        description: 'Users login.',
        type: TokenValidResponse,
    })
    @UseGuards(JwtAuthGuard)
    @Get('is-token-valid')
    async isTokenValid(@User() user) {
        return {user: user, statusCode: 200}
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}