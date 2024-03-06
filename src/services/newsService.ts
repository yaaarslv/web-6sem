import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {News} from "../models/News";
import {Repository} from "typeorm";
import {AppService} from "../app.service";
import {SubscribeService} from "./subscribeService";

@Injectable()
export class NewsService {
    constructor(private appService: AppService,
                private subscriberService: SubscribeService,
                @InjectRepository(News) private newsRepository: Repository<News>) {
    }

    async getManageNews(): Promise<any> {
        try {
            const news = await this.newsRepository
                .createQueryBuilder('news')
                .orderBy('LENGTH(news.id)')
                .getMany();
            return {success: true, news};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Ошибка при получении новостей'};
        }
    }

    async postManageNews(req: Request): Promise<any> {
        const data = req.body;

        if ('subject' in data && 'text' in data) {
            const subject = data["subject"].toString();
            const text = data["text"].toString();

            try {
                const currentDatetime = new Date(Date.now() + 3 * 60 * 60 * 1000);
                const newNews = this.newsRepository.create({subject: subject, text: text, date: currentDatetime});
                await this.newsRepository.save(newNews);
                const subscribers = await this.subscriberService.getSubscribers();
                this.appService.sendMessageToSubscribers(subject, text, subscribers);
                return {success: true, message: 'Новость успешно добавлена'};
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Ошибка при добавлении новости'};
            }
        } else if ("newsId" in data && 'action' in data) {
            const newsId = data["newsId"];
            const action = data["action"];

            if (action == "change_subject") {
                const newSubject = data["newSubject"];
                try {
                    await this.newsRepository.update(newsId, {subject: newSubject});
                    return {success: true, message: `Заголовок новости с id ${newsId} изменен`};
                } catch (error) {
                    console.error(error);
                    return {success: false, error: 'Ошибка при изменении заголовка новости'};
                }
            } else if (action == "change_text") {
                const newText = data["newText"];
                try {
                    await this.newsRepository.update(newsId, {text: newText});
                    return {success: true, message: `Текст новости с id ${newsId} изменен`};
                } catch (error) {
                    console.error(error);
                    return {success: false, error: 'Ошибка при изменении текста новости'};
                }
            } else if (action == "delete_news") {
                try {
                    await this.newsRepository.delete(newsId);
                    return {success: true, message: `Новость с id ${newsId} успешно удалена`};
                } catch (error) {
                    console.error(error);
                    return {success: false, error: 'Ошибка при изменении текста новости'};
                }
            }
        }
        return {success: false, error: 'Неизвестное действие'};
    }
}