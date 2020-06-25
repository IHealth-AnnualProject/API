import 'dotenv/config';
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {INestApplication, ValidationPipe} from "@nestjs/common";
jest.setTimeout(10000);
import * as request from 'supertest';
import {Repository} from "typeorm";
import {Difficulty, QuestEntity} from "../../../src/quest/quest.entity";
import {QuestModule} from "../../../src/quest/quest.module";
import {QuestCreation} from "../../../src/quest/quest.validation";
import {UserProfileModule} from "../../../src/userProfile/userProfile.module";
import {PsychologistModule} from "../../../src/psychologist/psychologist.module";
import {PsychologistRO} from "../../../src/psychologist/psychologist.dto";
let app: INestApplication;
let repository: Repository<QuestEntity>;
let token;
let id;
let userId;
describe("Quest route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [
                    PsychologistModule,
                    QuestModule,
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
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar",isPsy:true,email:"hello@hello.fr" });
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });


    it('/ (Post) create quest return 201 ', () => {
        let quest:QuestCreation= {name:"A quest",description:"faut faire ca ",difficulty:Difficulty.EASY};
        return  request(app.getHttpServer())
            .post('/quest').set('Authorization', 'Bearer ' + token).send(quest)
            .expect(201);
    });

    it('/ (Post) create same quest should return ', () => {
        let quest:QuestCreation= {name:"A quest",description:"faut faire ca ",difficulty:Difficulty.EASY};
        return  request(app.getHttpServer())
            .post('/quest').set('Authorization', 'Bearer ' + token).send(quest)
            .expect(409);
    });


    it('/ (Post) create same quest should return ', () => {
        let quest:QuestCreation= {name:"A quest",description:"faut faire ca ",difficulty:Difficulty.EASY};
        return  request(app.getHttpServer())
            .post('/quest').set('Authorization', 'Bearer ' + token).send(quest)
            .expect(409);
    });

    it('/ (Get) get quests done return 0', async () => {
        let result =  await  request(app.getHttpServer())
            .get('/quest/done').set('Authorization', 'Bearer ' + token);
        expect(result.body.length).toBe(0);
    });

    it('/ (Get) get quests', async () => {
        let quest:QuestCreation= {name:"A quest",description:"faut faire ca ",difficulty:Difficulty.EASY};
        let result =  await  request(app.getHttpServer())
            .get('/quest').set('Authorization', 'Bearer ' + token);
        expect(result.body.length).toBe(1);
        id = result.body[0].id
    });

    it('/ (Post) Validate quests', async () => {
        await  request(app.getHttpServer())
            .post('/quest/'+id+'/validate').set('Authorization', 'Bearer ' + token);
        let res = await  request(app.getHttpServer())
            .get('/psychologist/'+userId).set('Authorization', 'Bearer ' + token);
        expect(res.body.user.xp).toBe(10);
    });

    it('/ (Post) Validate quests',  () => {
        return  request(app.getHttpServer())
            .post('/quest/'+id+'/validate').set('Authorization', 'Bearer ' + token).expect(409);
    });

    it('/ (Get) get quests done return 1', async () => {
        let result =  await  request(app.getHttpServer())
            .get('/quest/done').set('Authorization', 'Bearer ' + token);
        expect(result.body[0].id).toBe(id);
    });

    afterAll(async () => {
        await repository.query('DELETE FROM quest_validation');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await repository.query('DELETE FROM quest');
        await app.close();
    });

});