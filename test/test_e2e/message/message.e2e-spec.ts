import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
let app: INestApplication;
let repository: Repository<FriendRequestEntity>;
import * as io from 'socket.io-client';

import 'dotenv/config';
import {FriendRequestEntity} from "../../../src/friendRequest/friendRequest.entity";
import {FriendRequestModule} from "../../../src/friendRequest/friendRequest.module";
import {Repository} from "typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {UserProfileModule} from "../../../src/userProfile/userProfile.module";
import {MessageService} from "../../../src/message/message.service";
import {MessageModule} from "../../../src/message/message.module";
import {GatewayModule} from "../../../src/gateway/gateway.module";
import {DialogFlowService} from "../../../src/dialogflow/dialogflow.service";
jest.setTimeout(100000);
let token_user1;
let token_user2;
let token_user3;
let idUser1;
let idUser2;
let idUser3;
let socket;
describe("message route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    DialogFlowService,
                    GatewayModule,
                    MessageModule,
                    AuthModule,
                    UserProfileModule,
                    // Use the e2e_test database to run the tests
                    TypeOrmModule.forRoot({
                        type: "mysql",
                        host: process.env.NEST_HOST,
                        username: process.env.TEST_USERNAME,
                        password: process.env.TEST_PASSWORD || '',
                        synchronize: true,
                        logging: false,
                        entities: ["src/**/*.entity.ts"],
                        port: parseInt(process.env.TEST_PORT),
                        database: process.env.TEST_DATABASE,
                    }),
                ],
            }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        await app.init();
        repository = module.get('MessageEntityRepository');

        await request(app.getHttpServer()).post('/auth/register').send({username:"medi",password:"escobar",isPsy:false });
        await request(app.getHttpServer()).post('/auth/register').send({username:"herve",password:"escobar",isPsy:false });
        await request(app.getHttpServer()).post('/auth/register').send({username:"jeanne",password:"escobar",isPsy:false });
        let user1_result = await request(app.getHttpServer()).post('/auth/login').send({username:"herve",password:"escobar"});
        token_user1 = user1_result.body.token.access_token;
        idUser1 = user1_result.body.user.id;
        let user2_result = await request(app.getHttpServer()).post('/auth/login').send({username:"jeanne",password:"escobar"});
        token_user2 = user2_result.body.token.access_token;
        idUser2 = user2_result.body.user.id;
        let user3_result = await request(app.getHttpServer()).post('/auth/login').send({username:"medi",password:"escobar",isPsy:false });
        token_user3 = user3_result.body.token.access_token;
        idUser3 = user3_result.body.user.id;
        socket = io.connect('http://localhost:4001');
    });

    it('/ (Get) get active conversation', async () => {
        let message2 ={ token:token_user3, data:{content: "hello",idReceiver:idUser1}};
        let message ={ token:token_user1, data:{content: "hello",idReceiver:idUser2}};
        //setTimeout(() => socket.emit('sendMessage',message), 1000);
        await socket.emit('sendMessage',message);
        await socket.emit('sendMessage',message);
        await socket.emit('sendMessage',message2);
        await new Promise(r => setTimeout(r, 400));
        let result = await request(app.getHttpServer())
            .get('/conversation/').set('Authorization', 'Bearer ' + token_user1)
            .expect(200);
        expect(result.body.length).toBe(2);

    });


    it('/ (Get) get all messages of a conversation', async () => {
        let message ={ token:token_user2, data:{content: "4",idReceiver:idUser1}};
        //setTimeout(() => socket.emit('sendMessage',message), 1000);
        await socket.emit('sendMessage',message);
        await socket.emit('sendMessage',message);
        await new Promise(r => setTimeout(r, 400));
        let result = await request(app.getHttpServer())
            .get('/conversation/'+idUser2+'/user').set('Authorization', 'Bearer ' + token_user1)
            .expect(200);
        expect(result.body.length).toBe(4);
        expect(result.body[3].textMessage).toBe("4");

    });


    it('/ (Get) Try to send message to chatbot', async () => {
        let message ={ token:token_user2, data:{content: "Hello",idReceiver:'betsbi-chatbot'}};
        //setTimeout(() => socket.emit('sendMessage',message), 1000);
        await socket.emit('sendMessage',message);
        await new Promise(r => setTimeout(r, 4000));
        let result = await request(app.getHttpServer())
            .get('/conversation/'+'betsbi-chatbot'+'/user').set('Authorization', 'Bearer ' + token_user2)
            .expect(200);
        expect(result.body.length).toBe(2);
        expect(result.body[0].textMessage).toBe("Hello");

    });

    afterAll(async () => {
        socket.disconnect();
        await repository.query('DELETE FROM message;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});