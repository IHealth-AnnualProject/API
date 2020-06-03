import 'dotenv/config';
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../../../src/auth/auth.module";
import {INestApplication, ValidationPipe} from "@nestjs/common";
jest.setTimeout(25000);
import * as request from 'supertest';
import {Repository} from "typeorm";
import {Difficulty, QuestEntity} from "../../../src/quest/quest.entity";
import {QuestModule} from "../../../src/quest/quest.module";
import {QuestCreation} from "../../../src/quest/quest.validation";
import {UserProfileModule} from "../../../src/userProfile/userProfile.module";
import {PsychologistModule} from "../../../src/psychologist/psychologist.module";
import {PsychologistRO} from "../../../src/psychologist/psychologist.dto";
import {MusicModule} from "../../../src/music/music.module";
let app: INestApplication;
let repository: Repository<QuestEntity>;
let token;
let id;
let userId;
let fs = require('fs');

describe("Music route", ()=>{
    beforeAll(async()=> {
        const module = await
            Test.createTestingModule({
                imports: [MusicModule,
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
        await request(app.getHttpServer()).post('/auth/register').send({username:"pabla",password:"escobar",isPsy:true });
        let result = await request(app.getHttpServer()).post('/auth/login').send({username:"pabla",password:"escobar"});
        token = result.body.token.access_token;
        userId = result.body.user.id;
    });

    /*
    it('/ (Get) get quests', async () => {
        let quest:QuestCreation= {name:"A quest",description:"faut faire ca ",difficulty:Difficulty.EASY};
        let result =  await  request(app.getHttpServer())
            .get('/quest').set('Authorization', 'Bearer ' + token);
        expect(result.body.length).toBe(1);
        id = result.body[0].id
    });*/

    it('/ (Post) post music', async () => {
        return await  request(app.getHttpServer())
            .post('/music/').set('Authorization', 'Bearer ' + token).field('name', 'davidgeto')
            .attach('file','./test/resources/music.wma')
            .expect(201);
    });
    it('/ (Post) post music wrong file', async () => {
        return await  request(app.getHttpServer())
            .post('/music/').set('Authorization', 'Bearer ' + token).field('name', 'davigeto2')
            .attach('file','./test/resources/dummyfile')
            .expect(422);
    });

    it('/ (Post) Get musics', async () => {
        let res = await  request(app.getHttpServer())
            .get('/music/').set('Authorization', 'Bearer ' + token)
            .expect(200);
        expect(res.body.length).toBe(1);
    });

    afterAll(async () => {
        clear_file();
        await repository.query('DELETE FROM music;');
        await repository.query('DELETE FROM user_profile;');
        await repository.query('DELETE FROM psychologist;');
        await repository.query('DELETE FROM user;');
        await app.close();
    });

    function clear_file(){
        fs.readdir('./song',function(err,files){
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            files.forEach(function (file) {
                // Do whatever you want to do with the file
                fs.unlinkSync('./song/'+file);
            });
        })
    }
});