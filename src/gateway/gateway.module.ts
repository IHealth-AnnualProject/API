
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {GatewayService} from "./gateway.service";
import {MessageService} from "../message/message.service";
import {MessageModule} from "../message/message.module";
import {AuthModule} from "../auth/auth.module";
import {JwtStrategy} from "../auth/jwt.strategy";
import {UserModule} from "../user/user.module";
import {DialogFlowService} from "../dialogflow/dialogflow.service";


@Module({
    imports: [MessageModule,AuthModule,UserModule],
    providers: [GatewayService,JwtStrategy,DialogFlowService],
    controllers:[],
    exports: [GatewayService],
})

export class GatewayModule {}