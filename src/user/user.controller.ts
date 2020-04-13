import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import {UserService} from "./user.service";
import {UserDTO} from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

}
