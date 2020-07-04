import {ReportService} from "./report.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ReportRO} from "./report.dto";
import {ReportCreation} from "./report.validation";


@Controller('report')
@ApiTags('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('getLast')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async getLast() {
        return await this.reportService.getLast();
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type:[ReportRO]})
    async read() {
        return await this.reportService.findAll();
    }

    @Get(':userId/reported')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({})
    async findById(@Param('userId') userId) {
       return await this.reportService.findReportOnUser(userId);
    }


    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async create(@Body() report:ReportCreation,@User() user) {
        return await this.reportService.create(report,user.userId);
    }

    @Delete(':idReport')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async delete(@Param('idReport') reportId,@User() user,) {
        return await this.reportService.delete(reportId);
    }


}
