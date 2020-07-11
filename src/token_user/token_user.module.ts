import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {TokenUserEntity} from "./token_user.entity";
import {TokenUserService} from "./token_user.service";


@Module({
    imports: [TypeOrmModule.forFeature([TokenUserEntity])],
    providers: [TokenUserService],
    controllers:[],
    exports: [TokenUserService],
})
export class TokenUserModule {}