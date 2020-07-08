import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {
    }

    public async sendEmail(receiver:string) {
        console.log(receiver);
        await this
            .mailerService
            .sendMail({
                to: receiver, // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: 'welcome', // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then((ee) => {
                console.log(ee)
            })
            .catch((ee) => {
                console.log(ee)
            });
    }
}