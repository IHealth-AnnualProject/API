
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {MusicEntity} from "./music.entity";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {MusicService} from "./music.service";
import {MusicController} from "./music.controller";



@Module({
    imports: [TypeOrmModule.forFeature([MusicEntity]),AuthModule,UserModule],
    providers: [MusicService],
    controllers:[MusicController],
    exports: [MusicService],
})
export class MusicModule {}