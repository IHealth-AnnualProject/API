
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {MessageService} from "../message/message.service";
import {MessageModule} from "../message/message.module";
import {AuthModule} from "../auth/auth.module";
import {JwtStrategy} from "../auth/jwt.strategy";
import {UserModule} from "../user/user.module";
import {DialogFlowService} from "../dialogflow/dialogflow.service";
import {EmailService} from "./email.service";
import {MailerModule, MailerService} from "@nestjs-modules/mailer";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import 'dotenv/config';

@Module({
    imports: [ MailerModule.forRoot({
        //transport:  "smtp://esgi.projet@gmail.com:esgithebest@smtp.gmail.com:587/?ignoreTLS=true&requireTLS=false&secure=false&tls:false",
            transport:{
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
                "user": "esgi.projet@gmail.com",
                "pass": process.env.MAIL_PASSWORD
            },
            tls: {
                "rejectUnauthorized": false
            }
        },
        defaults: {
            from:'"nest-modules" <modules@nestjs.com>',
        },
        template: {
            dir: __dirname + '/templates',
            adapter: new PugAdapter(),
            options: {
                strict: true,
            },
        },
    })],
    providers: [EmailService],
    controllers:[],
    exports: [EmailService],
})

export class EmailModule {}