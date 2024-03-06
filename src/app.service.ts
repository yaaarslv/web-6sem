import {Injectable} from '@nestjs/common';
import {Email} from './models/Email';
import {randomInt} from 'crypto';
import * as path from "path";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "./models/User";
import {Repository} from "typeorm";
const {Client} = require('pg');

let bcrypt = require('bcrypt');


@Injectable()
export class AppService {
    private emailHandler: Email;
    private client: any;
    private requestTimes: number[] = [];

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>) {
        this.client = new Client({
            database: 'neondb',
            user: 'yaaarslv',
            password: 'bC4ZAwVvoU0u',
            host: 'ep-young-mode-85085940.us-west-2.aws.neon.tech',
            ssl: true
        });
        this.emailHandler = new Email('petshop-yaarslv@yandex.ru');
    }

    public addRequestTime(time: number): void {
        this.requestTimes.push(time);
    }

    public getTotalRequestTime(): number {
        const sum = this.requestTimes.reduce((total, time) => total + time, 0);
        this.requestTimes = [];
        return sum;
    }

    sendCodeToEmail(recipient): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для регистрации на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    sendRecoverCodeToEmail(recipient): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для восстановления пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addRecoverConfirmationCode(code, recipient);
    }

    sendMessageAboutSubscription(recipient): void {
        const subject = 'Благодарим за подписку!';
        const text = 'Вы успешно подписались на уведомления от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutUnsubscription(recipient): void {
        const subject = 'Отмена подписки';
        const text = 'Вы успешно отписались от рассылки уведомлений от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutNewPassword(recipient): void {
        const subject = 'Смена пароля';
        const text = 'Вы успешно сменили пароль на сайте Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageToSubscribers(subject, text, recipients: string[]): void {
        const unsubscribeLink = 'https://beb-web.onrender.com/cancel-subscription';
        const messageText = `${text}\n\nВы получили это письмо, потому что подписались на рассылку от сайта Petshop. Если вы больше не хотите получать эти уведомления, перейдите по ссылке ${unsubscribeLink}`;
        recipients.forEach(recipient => {
            try {
                this.emailHandler.sendMail(subject, recipient, messageText);
            } catch (e) {
                console.log(e);
            }
        });
    }

    sendNewPasswordConfirmationCode(recipient): void {
        const subject = 'Код подтверждения для сброса пароля';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для сброса пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    async connect() {
        try {
            await this.client.connect();
        } catch {
            console.error('Error');
        }
    }

    async addConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            await this.client.query('BEGIN');
            await this.client.query('INSERT INTO ConfirmationCodes (code, recipient_email) VALUES ($1, $2)', [code, recipientEmail]);
            await this.client.query('COMMIT');
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            // await this.client.end();
        }
    }

    async addRecoverConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            await this.client.query('BEGIN');
            await this.client.query('INSERT INTO RecoverConfirmationCodes (code, recipient_email) VALUES ($1, $2)', [code, recipientEmail]);
            await this.client.query('COMMIT');
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            // await this.client.end();
        }
    }

    async checkConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            const result = await this.client.query('SELECT Id FROM ConfirmationCodes WHERE code = $1 AND recipient_email = $2', [code, recipientEmail]);
            if (result.rows.length > 0) {
                await this.client.query('BEGIN');
                await this.client.query('DELETE FROM ConfirmationCodes WHERE Id = $1', [result.rows[0].id]);
                await this.client.query('COMMIT');
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            // await this.client.end();
        }
    }

    async checkRecoverConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            const result = await this.client.query('SELECT Id FROM RecoverConfirmationCodes WHERE code = $1 AND recipient_email = $2', [code, recipientEmail]);
            if (result.rows.length > 0) {
                await this.client.query('BEGIN');
                await this.client.query('DELETE FROM RecoverConfirmationCodes WHERE Id = $1', [result.rows[0].id]);
                await this.client.query('COMMIT');
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            // await this.client.end();
        }
    }

    async sendCode(req: Request): Promise<any> {
        const data = req.body;

        if ('recipient' in data) {
            const recipient = data['recipient'];

            try {
                this.sendCodeToEmail(recipient);
                return {'success': true, 'message': 'Код отправлен!'};
            } catch (error) {
                console.log(error)
                return {'success': false, 'error': "Произошла ошибка"};
            }
        }

        return {'success': false, 'error': 'Переданы не все параметры!'};
    }

    async sendRecoverCode(req: Request): Promise<any> {
        const data = req.body;

        if ('recipient' in data) {
            const recipient = data['recipient'];

            try {
                this.sendRecoverCodeToEmail(recipient);
                return {'success': true, 'message': 'Код отправлен!'};
            } catch (error) {
                console.log(error)
                return {'success': false, 'error': "Произошла ошибка"};
            }
        }

        return {'success': false, 'error': 'Переданы не все параметры!'};
    }

    async checkRecoverCode(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["email", "code"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const code = data['code'];

            const result = this.checkRecoverConfirmationCode(code, email);
            if (!result) {
                return {'success': false, 'error': 'Неверный код подтверждения!'};
            }
            const user = this.userRepository.findOneBy({email: email});
            if (user) {
                return {'success': true, 'email': email};
            }
            return {'success': false, 'error': 'Пользователя с такой почтой не существует!'};
        }
        return {'success': false, 'error': 'Неверные учетные данные'};

    }
}
