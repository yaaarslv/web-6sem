import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Cart_items} from "../models/Cart_items";
import {Repository} from "typeorm";
import {Products} from "../models/Products";

@Injectable()
export class CartItemService {
    constructor(@InjectRepository(Cart_items) private cartItemRepository: Repository<Cart_items>,
                @InjectRepository(Products) private productRepository: Repository<Products>) {
    }

    async cart(data): Promise<any> {


        try {
            const requiredKeys = ["cart_id"];

            if (requiredKeys.every(key => key in data)) {
                const cart_id = data['cart_id'];
                const cartItems = await this.cartItemRepository.findBy({cart_id: cart_id});
                const products = await this.productRepository.find();

                const result = cartItems.map((item: any) => {
                    const product = products.find((p: any) => p.productid === item.product_id);
                    return {
                        quantity: item.quantity,
                        id: item.cart_item_id,
                        ...product,
                    };
                });

                return {success: true, products: result};
            } else {
                return {success: false, error: 'Неправильный запрос'};
            }
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Попробуйте ещё раз'};
        }
    }

    async changeQuantity(data): Promise<any> {
        const requiredKeys = ['cartProductId', 'newQuantity'];

        if (requiredKeys.every(key => key in data)) {
            const cart_item_id = data['cartProductId'];
            const quantity = data['newQuantity'];

            try {
                await this.cartItemRepository.update(cart_item_id, {quantity: quantity});
                return {'success': true}
            } catch (error) {
                console.log(error);
                return {'success': false, 'error': 'Произошла ошибка'};
            }
        }
    }

    async deleteCartProduct(data): Promise<any> {


        const requiredKeys = ['cartProductId'];

        if (requiredKeys.every(key => key in data)) {
            const cart_item_id = data['cartProductId'];

            try {
                await this.cartItemRepository.delete(cart_item_id);
            } catch (error) {
                console.log(error);
                return {'success': false, 'error': 'Произошла ошибка'};
            }

            return {'success': true}
        }
    }

    async addProductToCart(data): Promise<any> {


        const requiredKeys = ['productId', 'cart_id'];

        if (requiredKeys.every(key => key in data)) {
            const productId = data['productId'];
            const cart_id = data['cart_id'];
            try {
                const cart_item = this.cartItemRepository.create({
                    cart_id: cart_id,
                    product_id: productId,
                    quantity: 1
                });
                await this.cartItemRepository.save(cart_item);
                return {'success': true, 'cart_item_id': cart_item.cart_item_id};
            } catch (e) {
                console.log(e);
                return {'success': false, 'error': 'Произошла ошибка'};
            }
        }
    }
}