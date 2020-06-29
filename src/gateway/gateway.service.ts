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
import {UserDTO} from "../user/user.dto";
import {DialogFlowService} from "../dialogflow/dialogflow.service";
const { v4: uuidv4 } = require('uuid');


@WebSocketGateway(4001, { transport: ['websocket'] })
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private messageService:MessageService,private userService:UserService,private dialogFlowService:DialogFlowService) {
        this._chatBotCreation();
    }

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
            let messageDTO:MessageDTO = this._messageToMessageDTO(message,user);
            if(message.idReceiver==='betsbi-chatbot'){
                let res:string = await this.dialogFlowService.sendMessage(messageDTO.from,messageDTO.textMessage);
                if(res){
                    let botMessageDTO:MessageDTO = this._botMessageToMessageDTO(res,user);
                    this.wss.to(user.id).emit('newMessage',{message: botMessageDTO, senderUsername:user.username});
                    await this.messageService.create(messageDTO);
                    await this.messageService.create(botMessageDTO);
                    return
                }

            }
            await this.messageService.create(messageDTO);
            this.wss.to(message.idReceiver).emit('newMessage',{message: messageDTO, senderUsername:user.username});
            this.logger.log('sendMessage');
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

    _botMessageToMessageDTO(content:string,user){
        let res :MessageDTO = new MessageDTO();
        res.textMessage=content;
        res.date = Date.now().toString();
        res.from="betsbi-chatbot";
        res.to=user.id;
        return res;
    }

    async _chatBotCreation(){
        let chatbot = await this.userService.findOneById("betsbi-chatbot");
        if(!chatbot){
            let user:UserDTO= {id:"betsbi-chatbot",username:"Betsbi-chatbot",password:uuidv4(),isPsy:true};
            await this.userService.register(user);
        }
    }
}