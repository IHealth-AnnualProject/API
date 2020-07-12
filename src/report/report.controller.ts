import {ReportService} from "./report.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {ReportRO} from "./report.dto";
import {ReportCreation} from "./report.validation";
import {AdminGuard} from "../auth/admin.guard";
import {UserService} from "../user/user.service";


@Controller('report')
@ApiTags('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('getLast')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async getLast() {
        return await this.reportService.getLast();
    }

    @Get('')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type:[ReportRO]})
    async read() {
        return await this.reportService.findAll();
    }

    @Get(':userId/reported')
    @UseGuards(AdminGuard)
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
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async delete(@Param('idReport') reportId,@User() user,) {
        return await this.reportService.delete(reportId);
    }
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @Get(':idReport')
    async getValidById(@User() user,@Param('idReport') idReport) {
        return await this.reportService.getReportByID(idReport);
    }

    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @Post(':idReport/ban')
    async ban(@User() user,@Param('idReport') idReport) {
        return await this.reportService.banUser(idReport);
    }

    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    @Post(':idReport/forgive')
    async forgive(@User() user,@Param('idReport') idReport) {
        return await this.reportService.forgiveUser(idReport);
    }


}
