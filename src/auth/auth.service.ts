
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UserService} from "../user/user.service";
import { PsyValidationService } from '../psy_validation/psy_validation.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {

    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id ,isPsy: user.isPsy,isAdmin:user.isAdmin};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}