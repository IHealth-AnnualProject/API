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
import {DialogFlowModule} from "../../../src/dialogflow/dialogflow.module";
let token;
let userId;
describe("Auth route", ()=>{
    beforeAll(async()=> {
    const module = await
    Test.createTestingModule({
        imports: [
            AuthModule,
            DialogFlowModule,
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
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar",isPsy:false ,email:"hello@hello.fr" });
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });

    it('/ (POST) Login with no argument should return 400', () => {
        return request(app.getHttpServer())
            .post('/dialogflow/intent').set('Authorization', 'Bearer ' + token).send({
                name:"un super intent"
            })
    });


    afterAll(async () => {
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});