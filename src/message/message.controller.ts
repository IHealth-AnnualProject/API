import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {MessageService} from "./message.service";
import {User} from "../decorator/user.decorator";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {MessageEntity, MessageEntityRO} from "./message.entity";
import {UserRO} from "../user/user.dto";

@Controller('conversation')
@ApiTags('conversation')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        type: [UserRO],
    })
   async getConversation(@User() user) {
        return await this.messageService.getConversation(user.userId);
    }

    @Get(':userId/user')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        type: [MessageEntityRO],
    })
    async getMessage(@Param() param,@User() user,) {
        return await this.messageService.getConversationMessage(user.userId,param.userId);
    }
}
