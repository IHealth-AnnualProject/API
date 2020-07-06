import 'dotenv/config';
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {INestApplication, ValidationPipe} from "@nestjs/common";
jest.setTimeout(10000);
import * as request from 'supertest';
import {Repository} from "typeorm";
import {Difficulty, QuestEntity} from "../../../src/quest/quest.entity";
import {QuestCreation} from "../../../src/quest/quest.validation";
import {ReportModule} from "../../../src/report/report.module";
import {ReportCreation} from "../../../src/report/report.validation";
let app: INestApplication;
let repository: Repository<QuestEntity>;
let token_user1;
let idUser1;
let token_user2;
let idUser2;
describe("Report route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    ReportModule,
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
        await request(app.getHttpServer()).post('/auth/register').send({username:"medi",password:"escobar",isPsy:false,email:"hello@hello.fr" });
        await request(app.getHttpServer()).post('/auth/register').send({username:"herve",password:"escobar",isPsy:false,email:"hello@hello.fr" });
        await request(app.getHttpServer()).post('/auth/register').send({username:"jeanne",password:"escobar",isPsy:false,email:"hello@hello.fr" });
        let user1_result = await request(app.getHttpServer()).post('/auth/login').send({username:"herve",password:"escobar"});
        token_user1 = user1_result.body.token.access_token;
        idUser1 = user1_result.body.user.id;
        let user2_result = await request(app.getHttpServer()).post('/auth/login').send({username:"jeanne",password:"escobar"});
        token_user2 = user2_result.body.token.access_token;
        idUser2 = user2_result.body.user.id;
    });


  it('/ (Post) create report return 400 ', () => {
    let quest= {name:"Méchant",description:"il a été méchant"};
    return  request(app.getHttpServer())
      .post('/report').set('Authorization', 'Bearer ' + token_user1).send(quest)
      .expect(400);
  });

  it('/ (Post) create report with wrong idreturn 400 ', () => {
    let quest:ReportCreation= {name:"Méchant",description:"il a été méchant",reportedUser:"zojodjz"};
    return  request(app.getHttpServer())
      .post('/report').set('Authorization', 'Bearer ' + token_user1).send(quest)
      .expect(400);
  });


  it('/ (Post) create report return 201 ', () => {
        let quest:ReportCreation= {name:"Méchant",description:"il a été méchant",reportedUser:idUser2};
        return  request(app.getHttpServer())
            .post('/report').set('Authorization', 'Bearer ' + token_user1).send(quest)
            .expect(201);
    });

  it('/ (GET) GET report return 201 ', () => {
    return  request(app.getHttpServer())
      .get('/report').set('Authorization', 'Bearer ' + token_user1)
      .expect(200);
  });

    it('/ (Get) get reports', async () => {
        let result =  await  request(app.getHttpServer())
            .get('/report/'+idUser2+'/reported').set('Authorization', 'Bearer ' + token_user1);
        expect(result.body.length).toBe(1);
        expect(result.body[0].from.id).toBe(idUser1);
        expect(result.body[0].to.id).toBe(idUser2);
    });


    it('/ (Get) get reports for user', async () => {
        let result =  await  request(app.getHttpServer())
            .get('/report/'+idUser1+'/reported').set('Authorization', 'Bearer ' + token_user1);
        expect(result.body.length).toBe(0);
    });

    afterAll(async () => {
        await repository.query('DELETE FROM report;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

});