import {ErrorService} from "./error.service";
import {ErrorController} from "./error.controller";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {ErrorEntity} from "./error.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";


@Module({
    imports: [TypeOrmModule.forFeature([ErrorEntity]),AuthModule,UserModule],
    providers: [ErrorService],
    controllers:[ErrorController],
    exports: [ErrorService],
})
export class ErrorModule {}