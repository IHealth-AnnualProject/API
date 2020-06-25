import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
let app: INestApplication;
let repository: Repository<FriendRequestEntity>;
import 'dotenv/config';
import {FriendRequestEntity} from "../../../src/friendRequest/friendRequest.entity";
import {FriendRequestModule} from "../../../src/friendRequest/friendRequest.module";
import {Repository} from "typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {UserProfileModule} from "../../../src/userProfile/userProfile.module";
jest.setTimeout(10000);
let token_user1;
let token_user2;
let token_user3;
let idUser1;
let idUser2;
let idUser3;

let idRequest;
describe("friendRequest route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    FriendRequestModule,
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
        repository = module.get('FriendRequestEntityRepository');

        await request(app.getHttpServer()).post('/auth/register').send({username:"medi",password:"escobar",isPsy:false,email:"hello@hello.fr" });
        await request(app.getHttpServer()).post('/auth/register').send({username:"herve",password:"escobar",isPsy:false ,email:"hello@hello.fr"});
        await request(app.getHttpServer()).post('/auth/register').send({username:"jeanne",password:"escobar",isPsy:false ,email:"hello@hello.fr"});
        let user1_result = await request(app.getHttpServer()).post('/auth/login').send({username:"herve",password:"escobar" });
        token_user1 = user1_result.body.token.access_token;
        idUser1 = user1_result.body.user.id;
        let user2_result = await request(app.getHttpServer()).post('/auth/login').send({username:"jeanne",password:"escobar"});
        token_user2 = user2_result.body.token.access_token;
        idUser2 = user2_result.body.user.id;
        let user3_result = await request(app.getHttpServer()).post('/auth/login').send({username:"medi",password:"escobar",isPsy:false });
        token_user3 = user3_result.body.token.access_token;
        idUser3 = user3_result.body.user.id;


    });

    it('/ (POST) Create friendRequest without login should return 401', async () => {

        return request(app.getHttpServer())
            .post('/friend-request/'+idUser2)
            .expect(401)
            .expect({message:"Unauthorized",statusCode: 401});
    });

    it('/ (POST) Create request without ID ', async () => {

        return request(app.getHttpServer())
            .post('/friend-request/').set('Authorization', 'Bearer ' + token_user1)
            .expect(404)
    });

    it('/ (POST) Create request with ID should return 201 user1 add user 2 ', async () => {

        return request(app.getHttpServer())
            .post('/friend-request/'+idUser2).set('Authorization', 'Bearer ' + token_user1)
            .expect(201);
    });

    it('/ (Get) Get request pending should return 200 ', async () => {

        let result = await  request(app.getHttpServer())
            .get('/friend-request/pending').set('Authorization', 'Bearer ' + token_user2)
            .expect(200);
        expect(result.body[0].from.id).toBe(idUser1);
        idRequest=result.body[0].id;
    });

    it('/ (Post) accept should return 201 ', () => {
        return  request(app.getHttpServer())
            .post('/friend-request/'+idRequest+'/accept').set('Authorization', 'Bearer ' + token_user2)
            .expect(201);
    });

        it('/ (Get) Get my friend user1', () => {

            return request(app.getHttpServer())
                .get('/userProfile/'+idUser2+'/friends').set('Authorization', 'Bearer ' + token_user2)
                .expect(200).expect([{ id: idUser1, username: 'herve' }]);
        });
    //TODO CHANGER LE BLABLA
    it('/ (Get) Get my friend user2', () => {

        return request(app.getHttpServer())
            .get('/userProfile/'+idUser1+'/friends').set('Authorization', 'Bearer ' + token_user1)
            .expect(200).expect([{ id: idUser2, username: 'jeanne' }]);
    });

    it('/ (Get) Add a  second  friend to user1', async() => {
        await request(app.getHttpServer())
            .post('/friend-request/'+idUser3).set('Authorization', 'Bearer ' + token_user1)
            .expect(201);
        let result = await  request(app.getHttpServer())
            .get('/friend-request/pending').set('Authorization', 'Bearer ' + token_user3)
            .expect(200);
        let zango =result.body[0].id;
        await  request(app.getHttpServer())
            .post('/friend-request/'+zango+'/accept').set('Authorization', 'Bearer ' + token_user3)
            .expect(201);


         let res = await request(app.getHttpServer())
            .get('/userProfile/'+idUser1+'/friends').set('Authorization', 'Bearer ' + token_user1)
            .expect(200)
         expect(res.body.length).toBe(2);
    });

    afterAll(async () => {
        await repository.query('DELETE FROM friends;');
        await repository.query('DELETE FROM friend_request;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});