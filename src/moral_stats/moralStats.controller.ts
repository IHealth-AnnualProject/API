import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete, UseGuards,
} from '@nestjs/common';
import {MoralStatsService} from "./moralStats.service";
import {User} from "../decorator/user.decorator";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@Controller('moral-stats')
export class MoralStatsController {
    constructor(private readonly moralStatsService: MoralStatsService) {}



}
