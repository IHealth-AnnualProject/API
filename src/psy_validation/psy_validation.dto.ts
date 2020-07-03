import {ApiPropertyOptional} from "@nestjs/swagger";

export class PsyValidationRO {
    @ApiPropertyOptional()
    id:string;
    @ApiPropertyOptional()
    username:string;
    @ApiPropertyOptional()
    email:string;
}

export class PsyValidationDto {
  username:string;
  email:string;
  password:string;
}