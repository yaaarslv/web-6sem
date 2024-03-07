import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Reviews} from "../models/Review";
import {Repository} from "typeorm";

@Injectable()
export class ReviewService {
    constructor(@InjectRepository(Reviews) private reviewRepository: Repository<Reviews>) {
    }

    async getManageReviews(): Promise<any> {
        try {
            const reviews = await this.reviewRepository
                .createQueryBuilder('review')
                .orderBy('review.id')
                .getMany();
            return {success: true, reviews};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Ошибка при получении отзывов'};
        }
    }

    async postManageReviews(data): Promise<any> {
        

        const requiredKeys = ["author", "text"];

        if (requiredKeys.every(key => key in data)) {
            const author = data['author'];
            const text = data['text'];

            try {
                const review = this.reviewRepository.create({author: author, text: text});
                await this.reviewRepository.save(review);
                return {success: true, message: 'Отзыв успешно добавлен'};
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Ошибка при добавлении отзыва'};
            }
        }
    }
}