import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {AppController} from "./app.controller";
import {UserProfileModule} from "./userProfile/userProfile.module";
import {PsychologistModule} from "./psychologist/psychologist.module";


@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule,UserProfileModule,PsychologistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
