import {QuestService} from "./quest.service";
import {QuestController} from "./quest.controller";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {QuestEntity} from "./quest.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {QuestValidationEntity} from "./questValidation.entity";


@Module({
    imports: [TypeOrmModule.forFeature([QuestEntity]),TypeOrmModule.forFeature([QuestValidationEntity]),AuthModule,UserModule],
    providers: [QuestService],
    controllers:[QuestController],
    exports: [QuestService],
})
export class QuestModule {}