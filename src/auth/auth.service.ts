import {Injectable} from "@nestjs/common";
import {UserDetails} from "./userDetails";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../models/User";
import {Repository} from "typeorm";
import {Carts} from "../models/Carts";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
                @InjectRepository(Carts) private cartsRepository: Repository<Carts>) {
    }

    async validateUser(details: UserDetails){
        const user = await this.userRepository.findOneBy({email: details.email});
        if (user) {
            const cart_id_db = await this.cartsRepository.findOneBy({user_id: user.id})
            var cart_id = cart_id_db.cart_id
            return {user: user, cart_id: cart_id};
        }
        else {
            const newUser = this.userRepository.create(new Users(details.email, "notUselessNow", "User", false, JSON.parse(details.email_verified), details.displayName));
            const user = await this.userRepository.save(newUser);
            const newCart = this.cartsRepository.create({user_id: user.id});
            await this.cartsRepository.save(newCart);

            return {user: user, cart_id: newCart.cart_id};
        }
    }

    async findUser(id: number) {
        return await this.userRepository.findOneBy({id: id});
    }
}