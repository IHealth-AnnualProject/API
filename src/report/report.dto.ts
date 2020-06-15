import {ApiPropertyOptional} from "@nestjs/swagger";
import {UserEntity} from "../user/user.entity";
import {UserRO} from "../user/user.dto";

export class ReportRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    name:string;
    @ApiPropertyOptional()
    description:string;
    @ApiPropertyOptional()
    from:UserRO;
    @ApiPropertyOptional()
    to:UserRO;
}

export class ReportDTO {
    name:string;
    description:string;
    from;
    to;

}