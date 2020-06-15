import {ApiPropertyOptional} from "@nestjs/swagger";

export class ErrorRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    name:string;
    @ApiPropertyOptional()
    description:string;

}

export class ErrorDTO {
    id:string;
    name:string;
    description:string;

}