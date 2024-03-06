import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Subscribers} from "../models/Subscribers";
import {Repository} from "typeorm";
const {Client} = require('pg');
import {AppService} from "../app.service";

@Injectable()
export class SubscribeService {
    private client: any;

    constructor(private appService: AppService,
                @InjectRepository(Subscribers) private subscribeRepository: Repository<Subscribers>) {
        this.client = new Client({
            database: 'neondb',
            user: 'yaaarslv',
            password: 'bC4ZAwVvoU0u',
            host: 'ep-young-mode-85085940.us-west-2.aws.neon.tech',
            ssl: true
        });
    }

    async connect() {
        try {
            await this.client.connect();
        } catch {
            console.error('Error');
        }
    }

    async getSubscribers(): Promise<string[]> {
        try {
            await this.connect();
            const result = await this.client.query('SELECT email FROM Subscribers');

            return result.rows.map(row => row.email);
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async subscript(req: Request): Promise<any> {
        const data = req.body;
        if ('email' in data) {
            const email = data['email'].toString();

            const existingSubscriber = await this.subscribeRepository.findOneBy({email: email});

            if (existingSubscriber) {
                return {'success': false, 'error': 'Вы уже подписаны на рассылку'};
            }

            const newSubscriber = this.subscribeRepository.create({email: email});
            await this.subscribeRepository.save(newSubscriber);
            this.appService.sendMessageAboutSubscription(email);
            return {'success': true, 'message': 'Подписка оформлена!'};
        }
    }

    async unsubscript(req: Request): Promise<any> {
        const data = req.body;
        if ('email' in data) {
            const email = data['email'].toString();

            const existingSubscriber = await this.subscribeRepository.findOneBy({email: email});

            if (!existingSubscriber) {
                return {'success': false, 'error': 'Вы не подписаны на рассылку!'};
            }

            await this.subscribeRepository.delete(existingSubscriber.id);
            this.appService.sendMessageAboutUnsubscription(email);
            return {'success': true, 'message': 'Подписка отменена!'};
        }
    }
}