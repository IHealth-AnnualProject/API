import {INestApplication} from "@nestjs/common";
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

let token;
let id;
describe("Auth route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    UserProfileModule,
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

        await app.init();
        repository = module.get('UserProfileEntityRepository');
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar"});
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        console.log(token);
    });

    it('/ (POST) Create userProfile without login should return 401', async () => {

        return request(app.getHttpServer())
            .post('/userProfile')
            .expect(401)
            .expect({message:"Unauthorized",statusCode: 401});
    });

    it('/ (POST) Create userProfile with login should return 201', async () => {
        let res = await request(app.getHttpServer())
            .post('/userProfile').set('Authorization', 'Bearer ' + token).send({first_name:"pablaa"})
            .expect(201);
        expect(res.body.first_name).toEqual("pablaa");
        id = res.body.id;
    });

    it('/ (POST) Create second userProfile should return 409', async () => {
        return request(app.getHttpServer())
            .post('/userProfile').set('Authorization', 'Bearer ' + token)
            .expect(409)
            .expect({message:'User have already a profile.',statusCode:409});
    });

    it('/ (PATCH) Modify userProfile should return 200', () => {
        return request(app.getHttpServer())
            .patch('/userProfile').set('Authorization', 'Bearer ' + token).send({first_name:"pablo"})
            .expect(204)
    });

    it('/ (Get) Get userProfile return 200', () => {
        return request(app.getHttpServer())
            .get('/userProfile').set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([{ id:id,first_name: 'pablo', last_name: '', age: '', description: '' }]);
    });

    it('/ (Get) Get userProfile with id should return 200', () => {
        return request(app.getHttpServer())
            .get('/userProfile/'+id).set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({id:id, first_name: 'pablo', last_name: '', age: '', description: ''});
    });

    afterAll(async () => {
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});