import 'dotenv/config';
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {INestApplication, ValidationPipe} from "@nestjs/common";
jest.setTimeout(10000);
import * as request from 'supertest';
import {Repository} from "typeorm";
import {ErrorEntity} from "../../../src/error/error.entity";
import {ErrorModule} from "../../../src/error/error.module";
import {ErrorCreation} from "../../../src/error/error.validation";
let app: INestApplication;
let repository: Repository<ErrorEntity>;
let token;
let id;
let userId;
describe("Error route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    ErrorModule,
                    AuthModule,
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
        await new Promise(r => setTimeout(r, 1000));
        repository = module.get('UserProfileEntityRepository');
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"admin",password:"admin"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });


    it('/ (Post) create error return 201 ', () => {
        let quest:ErrorCreation= {name:"An error",description:"c de la daube"};
        return  request(app.getHttpServer())
            .post('/error').set('Authorization', 'Bearer ' + token).send(quest)
            .expect(201);
    });

    it('/ (Get) get errors', async () => {
        let result =  await  request(app.getHttpServer())
            .get('/error').set('Authorization', 'Bearer ' + token);
        expect(result.body.length).toBe(1);
        id = result.body[0].id
    });

    it('/ (Post) Get a error', async () => {
        let res =  await  request(app.getHttpServer())
            .get('/error/'+id).set('Authorization', 'Bearer ' + token)
            .expect(200);
        expect(res.body).toMatchObject({
            created: res.body.created,
            id: id,
            name:"An error",description:"c de la daube",
        })
    });

    it('/ (Post) Get last error', async () => {
        let error:ErrorCreation= {name:"An error",description:"coucou les cop1"};
       await request(app.getHttpServer())
            .post('/error').set('Authorization', 'Bearer ' + token).send(error)
            .expect(201);
        let res =  await  request(app.getHttpServer())
            .get('/error/getLast').set('Authorization', 'Bearer ' + token)
            .expect(200);
        return expect(res.body).toMatchObject({
            created: res.body.created,
            id: res.body.id,
            name:"An error",description:"coucou les cop1"
        })
    });

    afterAll(async () => {
        await repository.query('DELETE FROM error;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});