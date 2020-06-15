import {ReportService} from "./report.service";
import {ReportController} from "./report.controller";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {ReportEntity} from "./report.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";


@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity]),AuthModule,UserModule],
    providers: [ReportService],
    controllers:[ReportController],
    exports: [ReportService],
})
export class ReportModule {}