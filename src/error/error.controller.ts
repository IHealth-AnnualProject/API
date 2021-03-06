import {ErrorService} from "./error.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ErrorRO} from "./error.dto";
import {ErrorCreation} from "./error.validation";
import {AdminGuard} from "../auth/admin.guard";


@Controller('error')
@ApiTags('error')
export class ErrorController {
    constructor(private readonly errorService: ErrorService) {}

    @Get('getLast')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    async getLast() {
        console.log("ououuu");
        return await this.errorService.getLast();
    }

    @Get('')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type:[ErrorRO]})
    async read() {
        return await this.errorService.findAll();
    }

    @Get(':errorId')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async findById(@Param('errorId') errorId,@User() user) {
       return await this.errorService.findById(errorId);
    }

    @Post(':errorId/validate')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async validById(@Param('errorId') errorId,@User() user) {
        return await this.errorService.validById(errorId);
    }

    @Post(':errorId/pending')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async pendingById(@Param('errorId') errorId,@User() user) {
        return await this.errorService.pendingById(errorId);
    }


    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async create(@Body() error:ErrorCreation) {
        return await this.errorService.create(error);
    }

}
