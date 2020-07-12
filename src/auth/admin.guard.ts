import {CanActivate, ExecutionContext, HttpStatus, Injectable} from '@nestjs/common';
/*
    Custom imports for AuthService, jwt secret, etc...
*/
import * as jwt from 'jsonwebtoken';
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {jwtConstants} from "./constants";
import {WsException} from "@nestjs/websockets";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!user){
            return false
        }
        return user.isAdmin
    }
}