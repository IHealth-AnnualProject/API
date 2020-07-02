import {IsEmail, IsNotEmpty} from 'class-validator';
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

export class UserCreation {
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

    @ApiPropertyOptional()
    @IsEmail()
    email:string;
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
    @ApiProperty()
    xp:number;
    @ApiProperty()
    skin:string;
}

export class Token {
    @ApiProperty()
    access_token: string;
}


export class UserModif {
    @ApiProperty()
    skin: string;
}
export class UserAndTokenResponse {
    @ApiProperty()
    user:UserRO;
    @ApiProperty()
    token:Token;
}

export class addXp {
    @ApiProperty()
    xp: number;
}