import {Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards, Param, Delete} from '@nestjs/common';

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
import { PsyValidationService } from '../psy_validation/psy_validation.service';
import { PsyValidationDto } from '../psy_validation/psy_validation.dto';
@Controller('auth')
export class AuthController {
    constructor(private userService: UserService,
                private authService: AuthService,
                private userProfileService: UserProfileService,
                private psychologistService: PsychologistService,
                private psyValidationService: PsyValidationService
    ) {
        this._admincreation();
    }

    @Get('getLast')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async getLast() {
        return await this.psyValidationService.getLast();
    }

    @ApiCreatedResponse({
        description: 'Users login.',
        type: UserAndTokenResponse,
    })
    @Post('login')
    async login(@Body() userLogin: UserLogin) {
        const user = await this.userService.login(userLogin);
        const token = await this.authService.login(user);
        return {user, token};
    }


    @Post('register')
    async register(@Body() userDTO: UserCreation) {
        if (userDTO.username === undefined || userDTO.password === undefined ||userDTO.email ===undefined ) {
            throw new HttpException('Missing argument password username or email', HttpStatus.BAD_REQUEST);
        }
        let user = await this.userService.register(userDTO,userDTO.isPsy);

        if (!user.isPsy) {
            let userProfileDto: UserProfileDTOID = new UserProfileDTOID();
            userProfileDto.user = user.id;
            userProfileDto.id = user.id;
            userProfileDto.email = userDTO.email;
            return await this.userProfileService.create(userProfileDto);
        }

        let psyValidationDTO:PsyValidationDto= {username:user.username,email:userDTO.email,password:userDTO.password};
        return await this.psyValidationService.create(psyValidationDTO);

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

  @UseGuards(JwtAuthGuard)
  @Get('valid')
  async valid(@User() user) {
    return await this.psyValidationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid/:idPsyValidation')
  async getValidById(@User() user,@Param('idPsyValidation') idPsyValidation) {
    return await this.psyValidationService.findById(idPsyValidation);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validatePsy/:idPsyValidation')
  async validateUser(@User() user,@Param('idPsyValidation') idPsyValidation) {
       let psyValidationEntity= await this.psyValidationService.findById(idPsyValidation);
       let userDto:any = {username:psyValidationEntity.username,password:psyValidationEntity.password,email:psyValidationEntity.email,isPsy:true};
       let userDTO = await this.userService.register(userDto);

       let psychoID: PsychologistDTOID = new PsychologistDTOID();
       psychoID.user = userDTO.id;
       psychoID.id = userDTO.id;
       psychoID.first_name = "";
       psychoID.last_name = "";
       psychoID.email = userDto.email;
       await this.psychologistService.create(psychoID);
       return await this.psyValidationService.delete(idPsyValidation);

  }


  async _admincreation(){
    let admin = await this.userService.findOneById("admin");

    if(!admin){
      let user:UserCreation= {id:"admin",username:"admin",password:"admin",isPsy:false,email:"admin@admin.fr"};
      await this.userService.register(user,false);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@User() user){
    await this.userService.delete(user.userId);
    let userProfile = await this.userProfileService.findByUserId(user.userId);
    if(userProfile){
        return await this.userProfileService.delete(user.userId);
    }
    return await this.psychologistService.delete(user.userId)
  }

}