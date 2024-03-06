import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Carts} from "../models/Carts";

@Injectable()
export class CartService {
    constructor(@InjectRepository(Carts) private cartsRepository: Repository<Carts>) {
    }
}