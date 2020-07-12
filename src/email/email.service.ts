import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import 'dotenv/config';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {
    }

    public async sendEmail(receiver:string,token) {
        console.log(receiver);
        await this
            .mailerService
            .sendMail({
                to: receiver, // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'Betsbi - Changement de mot de passe', // Subject line
                text: 'welcome', // plaintext body
                html: '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<style>\n' +
                'body {\n' +
                '  text-align: left;\n' +
                '  font-family: Arial, Helvetica, sans-serif;\n' +
                '}\n' +
                '.card {\n' +
                '  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n' +
                '  transition: 0.3s;\n' +
                '  padding: 2px 16px;\n' +
                '}\n' +
                '.button {\n' +
                '    border: 0;\n' +
                '    line-height: 2.5;\n' +
                '    padding: 0 20px;\n' +
                '    font-size: 1rem;\n' +
                '    text-align: center;\n' +
                '    color: #fff;\n' +
                '    text-shadow: 1px 1px 1px #000;\n' +
                '    border-radius: 10px;\n' +
                '    background-color: rgba(220, 0, 0, 1);\n' +
                '    background-image: linear-gradient(to top left,\n' +
                '                                      rgba(0, 0, 0, .2),\n' +
                '                                      rgba(0, 0, 0, .2) 30%,\n' +
                '                                      rgba(0, 0, 0, 0));\n' +
                '    box-shadow: inset 2px 2px 3px rgba(255, 255, 255, .6),\n' +
                '                inset -2px -2px 3px rgba(0, 0, 0, .6);\n' +
                '}\n' +
                '</style>\n' +
                '</head>\n' +
                '<body>\n' +
                '  <div class="card">\n' +
                '    <h1>Reinitialiser votre Mot de passe ?</h1>\n' +
                '    <hr>\n' +
                '    <p>Vous avez fait une requête pour changer de mot de passe.</p>\n' +
                '    <p>Cliquez sur ce lien pour changer votre mot de passe .</p>\n' +
                '    <center><p><a href="'+process.env.APP_URL+':'+process.env.APP_WEB_PORT+'/changePass/?id='+token+'"><button class="button"type="button">Mettre à jour le mot de passe</button></a></p>\n' +
                '    <img src="https://i.ibb.co/S3H2qT2/betsbi.png" alt="BetsBi" style="width:200px"></center>\n '+
                '  </div>\n' +
                '</body>\n'
            })
            .then((ee) => {
                console.log(ee)
            })
            .catch((ee) => {
                console.log(ee)
            });
    }
}