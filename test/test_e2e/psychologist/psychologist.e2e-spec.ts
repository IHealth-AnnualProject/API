import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
import {AuthModule} from "../../../src/auth/auth.module";
import {Repository} from "typeorm";
let app: INestApplication;
let repository: Repository<PsychologistEntity>;
import 'dotenv/config';
import {PsychologistModule} from "../../../src/psychologist/psychologist.module";
import {PsychologistEntity} from "../../../src/psychologist/psychologist.entity";
jest.setTimeout(10000);
let token;
let id;
let userId;
describe("Psychologist route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    PsychologistModule,
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
        repository = module.get('UserProfileEntityRepository');
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar",isPsy:true ,email:"hello@hello.fr" });
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });


    it('/ (Get) Get psychologist return 200', async () => {
         let res = await request(app.getHttpServer())
            .get('/psychologist').set('Authorization', 'Bearer ' + token)
            .expect(200)
         expect(res.body.length).toBe(1);
         id = res.body[0].id
    });




    it('/ (PATCH) Modify psychologist should return 200', () => {
        return request(app.getHttpServer())
            .patch('/psychologist').set('Authorization', 'Bearer ' + token).send({first_name:"pablo"})
            .expect(204)
    });

    /*
    it('/ (Get) Should not create a psy with a user account', async () => {
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar",isPsy:false });
        //let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        let tokenUser = "o";
        return await request(app.getHttpServer())
            .post('/psychologist').set('Authorization', 'Bearer ' + tokenUser)
            .expect(401).expect({message:'You are not a psy',statusCode:401});
    });*/



   /* it('/ (Get) Get psychologist/id/user return 200',  () => {
      return request(app.getHttpServer())
            .get('/psychologist/'+userId+'/user').set('Authorization', 'Bearer ' + token)
            .expect(200).expect({
                id: id,
                first_name: 'pablo',
                last_name: '',
                age: '',
                description: ''
            });
    });

    it('/ (Get) Get psychologist/id return 200',  () => {
        return request(app.getHttpServer())
            .get('/psychologist/'+id).set('Authorization', 'Bearer ' + token)
            .expect(200).expect({
                id: id,
                first_name: 'pablo',
                last_name: '',
                age: '',
                description: '',
                user:{}
            });
    });*/
    it('/ (PATCH) Modify userProfile should return 200', () => {
        return request(app.getHttpServer())
            .patch('/psychologist').set('Authorization', 'Bearer ' + token).send({
                geolocation: "104 Rue Guynemer, Ermont, France||48.9965786,2.2603474999999946",
                description: "description",
                email:'unemail'
            })
            .expect(204)
    });

    afterAll(async () => {
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});