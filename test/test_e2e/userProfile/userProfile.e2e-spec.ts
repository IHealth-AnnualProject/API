import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
import {AuthModule} from "../../../src/auth/auth.module";
import {Repository} from "typeorm";
import {UserEntity} from "../../../src/user/user.entity";
let app: INestApplication;
let repository: Repository<UserProfileEntity>;
import 'dotenv/config';
import {UserProfileModule} from "../../../src/userProfile/userProfile.module";
import {UserProfileEntity} from "../../../src/userProfile/userProfile.entity";
import * as Assert from "assert";
jest.setTimeout(100000);
let token;
let id;
let userId;
let creationDate;
let email;
describe("UserProfile route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    UserProfileModule,AuthModule,
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
        repository = module.get('UserProfileEntityRepository');
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar" ,isPsy:false});
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });


    //todo check for localisation string error
    it('/ (PATCH) Modify userProfile should return 200', () => {
        return request(app.getHttpServer())
            .patch('/userProfile').set('Authorization', 'Bearer ' + token).send({
                geolocation: null,
                description: "description",
                email:'unemail'
            })
            .expect(204)
    });

    it('/ (Get) Get userProfile return 200', async () => {
        let result = await request(app.getHttpServer())
            .get('/userProfile').set('Authorization', 'Bearer ' + token)
            .expect(200);
        id = result.body[0].id;
        creationDate = result.body[0].user.created
        email = result.body[0].email;
    });

    it('/ (Get) Get userProfile/id/user return 200', async () => {
        return await request(app.getHttpServer())
            .get('/userProfile/'+userId+'/user').set('Authorization', 'Bearer ' + token)
            .expect(200).expect({
                id: id,
                description: 'description',
                email:email,
                user: {
                    id: userId,
                    created: creationDate,
                    username: 'pabla',
                    isPsy: false
                }
            });
    });

    it('/ (Get) Get userProfile/id return 200',  () => {
     return   request(app.getHttpServer())
            .get('/userProfile/'+id).set('Authorization', 'Bearer ' + token)
            .expect(200).expect({
                id: id,
                description: 'description',
                email:email,
                user: {
                     id: userId,
                     created: creationDate,
                     username: 'pabla',
                     isPsy: false
                 }
            });
    });

    it('/ (Get) Get userProfile with id should return 200', async () => {
        await request(app.getHttpServer())
            .post('/userProfile/moral-stats')
            .set('Authorization', 'Bearer ' + token).send({value:0});
       await request(app.getHttpServer())
                .post('/userProfile/moral-stats')
                .set('Authorization', 'Bearer ' + token).send({value:2});
         let res = await request(app.getHttpServer())
            .get('/userProfile/'+id+'/moral-stats').set('Authorization', 'Bearer ' + token)
            .expect(200);
        return expect(res.body.length).toBe(2);
    });

    //--- MORAL STATS ---
    it('/ (POST) Create moral-stats without login should return 401', async () => {
        return request(app.getHttpServer())
            .post('/userProfile/moral-stats')
            .expect(401)
            .expect({message:"Unauthorized",statusCode: 401});
    });

    it('/ (POST) Create moral-stats without value should return 400', async () => {
        return request(app.getHttpServer())
            .post('/userProfile/moral-stats').set('Authorization', 'Bearer ' + token)
            .expect(400)
            .expect({
                statusCode: 400,
                message: [ 'value should not be empty' ],
                error: 'Bad Request'
            });
    });

    it('/ (POST) Create moral-stats  with value should return 200', async () => {
        return request(app.getHttpServer())
            .post('/userProfile/moral-stats')
            .set('Authorization', 'Bearer ' + token).send({value:1})
            .expect(201)
    });

    /*it('/ (Get) Should not create a user with a psy', async () => {
        await request(app.getHttpServer()).post('/auth/register').send({username:"user",password:"escobar",isPsy:true}).timeout(10000);
        let login = await request(app.getHttpServer()).post('/auth/login').send({username:"user",password:"escobar"}).timeout(10000);
        let tokenUser = login.body.token.access_token;
        return request(app.getHttpServer())
            .post('/userProfile').set('Authorization', 'Bearer ' + tokenUser)
            .expect(401).expect({message:"You cant create userProfile as a psy",statusCode:401});
    });*/

    afterAll(async () => {
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM moral_stats;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});