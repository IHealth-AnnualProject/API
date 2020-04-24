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
                password:process.env.TEST_PASSWORD || '',
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
                    'isPsy should not be empty'
                ],
                error: 'Bad Request'
            });
    });

    it('/ (POST) Register without is psy argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pablota",password:"escobar"})
            .expect(400)
    });

    it('/ (POST) Register with argument should return 200', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pablota",password:"escobar",isPsy:true})
            .expect(201)
    });

    it('/ (POST) Login with argument should return 200', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({username:"pablota",password:"escobar"})
            .expect(201);
    });

    afterAll(async () => {
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});