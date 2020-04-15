import { IsNotEmpty } from 'class-validator';


export class UserDTO {
    id:string;
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
}