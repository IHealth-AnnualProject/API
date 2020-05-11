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
export class WsJwtGuard implements CanActivate {
    constructor(private authService: AuthService,
                private jwtStrategy:JwtStrategy) {}
    //TODO LE TOKEN EST PASSER EN CLAIR FAUT TROUVERU NE SOLUTION
    async canActivate(context: ExecutionContext) {
        try {
            const authToken = context.getArgs()[1].token;
            const jwtPayload = jwt.verify(authToken, jwtConstants.secret);
            const user = this.jwtStrategy.validate(authToken);
            //context.switchToWs().getData().user = user;
        }catch(e){
            //throw new WsException('Not Authorized');
            console.log(e);
            return false;
        }
        return true;
    }
}