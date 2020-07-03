import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import { PsyValidationEntity } from './psy_validation.entity';
import { PsyValidationService } from './psy_validation.service';


@Module({
    imports: [TypeOrmModule.forFeature([PsyValidationEntity])],
    providers: [PsyValidationService],
    exports: [PsyValidationService],
})
export class PsyValidationModule {}