import { IsNotEmpty } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {UserProfileRO} from "../userProfile/userProfile.dto";


export class UserDTO {
    id:string;
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    isPsy:boolean;
}

export class UserRO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    created: Date;
    @ApiProperty()
    isPsy:boolean;
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