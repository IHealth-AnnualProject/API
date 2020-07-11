
import {forwardRef, Module} from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {jwtConstants} from "./constants";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {LocalStrategy} from "./local.strategy";
import {AuthController} from "./auth.controller";
import {UserProfileModule} from "../userProfile/userProfile.module";
import {PsychologistModule} from "../psychologist/psychologist.module";
import { PsyValidationModule } from '../psy_validation/psy_validation.module';
import {EmailService} from "../email/email.service";
import {EmailModule} from "../email/email.module";
import {TokenUserModule} from "../token_user/token_user.module";


@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
        UserProfileModule,
        PsychologistModule,
        PsyValidationModule,EmailModule,TokenUserModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers:[AuthController],
    exports: [AuthService],
})
export class AuthModule {}