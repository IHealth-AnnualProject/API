import {QuestService} from "./quest.service";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {QuestCreation} from "./quest.validation";

@Controller('quest')
@ApiTags('quest')
export class QuestController {
    constructor(private readonly questService: QuestService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    async read() {
        return await this.questService.findAll();
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async create(@Body() quest:QuestCreation) {
        return await this.questService.create(quest);
    }


    @Get('done')
    @UseGuards(JwtAuthGuard)
    async questDone(@User() user) {
        return await this.questService.questDone(user.userId);
    }

    @Post(':idQuest/validate')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async validate(@Param() param,@User() user) {
        return await this.questService.validate(user.userId,param.idQuest);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
    })
    async delete(@Param() param,@User() user,) {
        return await this.questService.delete(param.id);
    }
}
