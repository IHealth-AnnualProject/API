import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {AppController} from "./app.controller";
import {AuthController} from "./auth/auth.controller";


@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
