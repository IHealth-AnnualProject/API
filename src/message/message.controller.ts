import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {FriendRequestService} from "../friendRequest/friendRequest.service";
import {MessageService} from "./message.service";
import {User} from "../decorator/user.decorator";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {UserProfileRO} from "../userProfile/userProfile.dto";
import {MessageEntity, MessageEntityRO} from "./message.entity";
import {UserRO} from "../user/user.dto";

@Controller('conversation')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        type: [UserRO],
    })
   async getConversation(@User() user) {
        console.log("conv");
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
