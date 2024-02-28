import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Cart_items {
    @PrimaryGeneratedColumn()
    cart_item_id: number;

    @Column()
    cart_id: number;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    constructor(cart_id: number, product_id: number, quantity: number) {
        this.cart_id = cart_id;
        this.product_id = product_id;
        this.quantity = quantity;
    }
}