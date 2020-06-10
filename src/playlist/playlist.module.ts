
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {PlaylistEntity} from "./playlist.entity";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {PlaylistService} from "./playlist.service";
import {PlaylistController} from "./playlist.controller";
import {MusicModule} from "../music/music.module";



@Module({
    imports: [TypeOrmModule.forFeature([PlaylistEntity]),AuthModule,UserModule,MusicModule],
    providers: [PlaylistService],
    controllers:[PlaylistController],
    exports: [PlaylistService],
})
export class PlaylistModule {}
