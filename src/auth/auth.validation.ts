import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UserLogin {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

}

export class ChangePassword {
    @ApiProperty()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}

export class ResetPassword{
    @ApiProperty()
    @IsNotEmpty()
    username: string;
}

export class CheckToken{
    @ApiProperty()
    @IsNotEmpty()
    token: string;
}