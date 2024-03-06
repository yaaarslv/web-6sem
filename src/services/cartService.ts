import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Carts} from "../models/Carts";
import {Client} from "pg";

@Injectable()
export class CartService {
    private client: any;

    constructor(@InjectRepository(Carts) private cartsRepository: Repository<Carts>) {
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
}