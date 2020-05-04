import {Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import {FriendRequestService} from "./friendRequest.service";
import {User} from "../decorator/user.decorator";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@Controller('friend-request')
export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':userToAddId')
    create(@User() user,@Param() param){
        return this.friendRequestService.addFriend(user.userId ,param.userToAddId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':requestId/accept')
    acceptRequest(@User() user,@Param() param){
        return this.friendRequestService.acceptFriendRequest(param.requestId,user.userId);
    }
    @UseGuards(JwtAuthGuard)
    @Post(':requestId/deny')
    denyRequest(@User() user,@Param() param){
        return this.friendRequestService.denyFriendRequest(user.userId,param.requestId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('denied')
    getMyFriendRequest(@User() user){
        return this.friendRequestService.getMyFriendRequest(user.userId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('accept')
    getMyFriend(@User() user){

        return this.friendRequestService.getMyFriend(user.userId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('pending')
    getMyPendingFriendRequest(@User() user){
        return this.friendRequestService.getMyPendingFriendRequest(user.userId);
    }
}
