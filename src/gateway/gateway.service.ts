import {Logger, UseGuards} from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, SubscribeMessage,
} from '@nestjs/websockets';

import {Socket,Server} from 'socket.io';
import {WsJwtGuard} from "../auth/ws-jwt-auth.guard";
import {Message, SocketWS, UserWS} from "../decorator/user.decorator";
import {MessageService} from "../message/message.service";
import {MessageDTO} from "../message/message.dto";
import {UserService} from "../user/user.service";



@WebSocketGateway(4001, { transport: ['websocket'] })
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private messageService:MessageService,private userService:UserService) {}

    @WebSocketServer()
    wss: Server;

    private logger = new Logger('GatewayService');

    handleConnection(client) {
        this.logger.log('New client connected');
        client.emit('connection', 'Successfully connected to server');
    }

    handleDisconnect(client) {
        this.logger.log('Client disconnected');
    }

    @SubscribeMessage('sub')
    @UseGuards(WsJwtGuard)
    subscribeToMessage(@UserWS() user,@SocketWS() socket:Socket) {
        this.logger.log('sub');
        //console.log(user);
        socket.emit('join', 'Join room : '+user.id);
        socket.join(user.id);
    }

    @SubscribeMessage('sendMessage')
    @UseGuards(WsJwtGuard)
    async sendMessage( @UserWS() user, @SocketWS() socket, @Message() message) {
        let receiver = await this.userService.findOneById(message.idReceiver);
        if(receiver){
            this.logger.log('sendMessage');
            let messageDTO:MessageDTO = this._messageToMessageDTO(message,user);
            console.log(message);
            await this.messageService.create(messageDTO);
            this.wss.to(message.idReceiver).emit('newMessage',{content:message.content,senderId:user.id,senderUsername:user.username});
        }

    }

    _messageToMessageDTO(message,user){
        let res :MessageDTO = new MessageDTO();
        res.textMessage=message.content;
        res.date = Date.now().toString();
        res.from=user.id;
        res.to=message.idReceiver;
        return res;
    }
}