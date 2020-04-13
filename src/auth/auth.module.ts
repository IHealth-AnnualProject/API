
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {jwtConstants} from "./constants";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {LocalStrategy} from "./local.strategy";
import {AuthController} from "./auth.controller";


@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers:[AuthController],
    exports: [AuthService],
})
export class AuthModule {}