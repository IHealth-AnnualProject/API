import {INestApplication} from "@nestjs/common";
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
                synchronize: true,
                logging: false,
                entities: ["src/**/*.entity.ts"],
                port: parseInt(process.env.TEST_PORT),
                database: process.env.TEST_DATABASE,
            }),
        ],
    }).compile();
    app = module.createNestApplication();

    await
    app.init();
    repository = module.get('UserEntityRepository');
    });

    it('/ (POST) Login with no argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .expect(400)
            .expect({message:"Invalid username/password",statusCode: 400});
    });

    it('/ (POST) Register with no argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register') .expect(400)
            .expect({message:"Missing argument password or username",statusCode: 400});
    });

    it('/ (POST) Register with argument should return 200', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({username:"pabla",password:"escobar"})
            .expect(201)
    });

    afterAll(async () => {
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});