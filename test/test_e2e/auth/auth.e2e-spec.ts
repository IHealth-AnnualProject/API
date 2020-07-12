import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
import {AuthModule} from "../../../src/auth/auth.module";
import {Repository} from "typeorm";
import {UserEntity} from "../../../src/user/user.entity";
let app: INestApplication;
let repository: Repository<UserEntity>;
import 'dotenv/config';
describe("Auth route", ()=>{
    beforeAll(async()=> {
    const module = await
    Test.createTestingModule({
        imports: [
            AuthModule,
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
    repository = module.get('UserEntityRepository');
    });

    it('/ (POST) Login with no argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .expect(400)
            .expect({
                statusCode: 400,
                message: [
                    'username should not be empty',
                    'password should not be empty',
                ],
                error: 'Bad Request'
            });
    });

    it('/ (POST) Register with no argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register') .expect(400)
            .expect({
                statusCode: 400,
                message: [
                    'username should not be empty',
                    'password should not be empty',
                    'isPsy should not be empty',
                    'email must be an email'
                ],
                error: 'Bad Request'
            });
    });

    it('/ (POST) Register without is psy argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pablota",password:"escobar",email:"hello@hello.fr"})
            .expect(400)
    });

    it('/ (POST) Register with wrongemail argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pablota",password:"escobar",isPsy:false,email:"helloahello.fr"})
            .expect(400)
    });

    it('/ (POST) Register with argument should return 200', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pablota",password:"escobar",isPsy:false,email:"tkt@aeae.fr"})
            .expect(201)
    });

    it('/ (POST) Login with argument should return 200', async () => {
        let result = await request(app.getHttpServer())
            .post('/auth/login')
            .send({username:"pablota",password:"escobar"})
            .expect(201);
        let token = result.body.token;
        let user = result.body.user;
        return await request(app.getHttpServer())
            .post('/auth/login')
            .send({username:"pablota",password:"escobar"})
            .expect(201)
            //.expect({user:user,token:token}) UN PROBLEM AVEC LE TOKEN C RANDOM C BYZARRE
    });

    it('/ (GET) Is token valid should return 200 and user', async () => {
        let result = await request(app.getHttpServer())
            .post('/auth/login')
            .send({username:"pablota",password:"escobar"})
            .expect(201);
        let token = result.body.token.access_token;
        let userId = result.body.user.id;
        return request(app.getHttpServer())
            .get('/auth/is-token-valid').set('Authorization', 'Bearer ' + token)
            .expect(200).expect({
                user: {
                    userId: userId,
                    username: 'pablota',
                    isPsy: false,
                    isAdmin: false
                },
                statusCode: 200
            });
    });

    it('/ (Get) Reset password no arg', async  () => {
        return await request(app.getHttpServer())
            .post('/auth/resetPassword')
            .expect(400)
    });


    it('/ (Get) Reset password', async  () => {
        return await request(app.getHttpServer())
            .post('/auth/resetPassword')
            .send({username:"pablota"})
            .expect(201)
    });

    it('/ (POST) Create admin should return 200', async () => {
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"admin",password:"admin"});
        let token = result.body.token.access_token;
        return await request(app.getHttpServer())
            .post('/auth/createAdmin').set('Authorization', 'Bearer ' + token)
            .send({username:"Admin2",password:"admin2",isPsy:false,email:"hello@hello.fr"})
            .expect(201)
    });

    afterAll(async () => {
        await repository.query('DELETE FROM token_user_entity;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});