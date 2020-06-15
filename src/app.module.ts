import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {AppController} from "./app.controller";
import {UserProfileModule} from "./userProfile/userProfile.module";
import {PsychologistModule} from "./psychologist/psychologist.module";
import {FriendRequestModule} from "./friendRequest/friendRequest.module";
import {JwtStrategy} from "./auth/jwt.strategy";
import {GatewayModule} from "./gateway/gateway.module";
import {QuestModule} from "./quest/quest.module";
import {MusicModule} from "./music/music.module";
import {PlaylistModule} from "./playlist/playlist.module";
import {ErrorModule} from "./error/error.module";
import {ReportModule} from "./report/report.module";


@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule,UserProfileModule,PsychologistModule,FriendRequestModule,GatewayModule,QuestModule,MusicModule,PlaylistModule,ErrorModule,ReportModule],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
