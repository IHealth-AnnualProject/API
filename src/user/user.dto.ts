import { IsNotEmpty } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';


export class UserDTO {
    id:string;
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}

export class UserRO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    created: Date;
}

export class Token {
    @ApiProperty()
    access_token: string;
}
export class UserAndTokenResponse {
    @ApiProperty()
    user:UserRO;
    @ApiProperty()
    token:Token;
}