import {FriendsService} from "./friends.service";
import {FriendsEntity} from "./friends.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";


@Module({
    imports: [TypeOrmModule.forFeature([FriendsEntity])],
    providers: [FriendsService],
    controllers:[],
    exports: [FriendsService],
})
export class FriendsModule {}