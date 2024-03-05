import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Carts {
    @PrimaryGeneratedColumn()
    cart_id: number;

    @Column()
    user_id: number;

    constructor(cart_id: number, user_id: number) {
        this.cart_id = cart_id;
        this.user_id = user_id;
    }
}