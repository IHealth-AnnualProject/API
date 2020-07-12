import {ApiPropertyOptional} from "@nestjs/swagger";
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
    @ApiPropertyOptional()
    created:Date;
    @ApiPropertyOptional()
    isResolved:boolean;
}

export class ReportDTO {
    name:string;
    description:string;
    from;
    to;

}