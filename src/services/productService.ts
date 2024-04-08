import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Products} from "../models/Products";
import {Repository} from "typeorm";
import {Cart_items} from "../models/Cart_items";
import {Server, Socket} from 'socket.io';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {ProductGateway} from "../websockets/product.gateway";

@Injectable()
@WebSocketGateway()
export class ProductService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(@InjectRepository(Products) private productRepository: Repository<Products>,
                @InjectRepository(Cart_items) private cartItemRepository: Repository<Cart_items>,
                private readonly productGateway: ProductGateway) {
    }

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    async getManageProducts(): Promise<any> {
        try {
            const products = await this.productRepository.query("SELECT * FROM Products ORDER BY ProductId");
            return {success: true, products};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Internal Server Error'};
        }
    }

    async postManageProducts(data): Promise<any> {
        if ('productId' in data && 'action' in data) {
            const productId = data['productId'];
            const action = data['action'];

            try {
                if (action === "change_name") {
                    const newName = data['newName'];
                    await this.productRepository.query("UPDATE Products SET name = $1 WHERE productId = $2", [newName, productId]);
                    await this.productGateway.sendProductUpdate(productId, {name: newName});
                    return {success: true, message: `Название товар с id ${productId} изменено на ${newName}`};
                } else if (action === "delete_product") {
                    await this.productRepository.query("DELETE FROM Products WHERE productId = $1", [productId]);
                    await this.productRepository.query("DELETE FROM Images WHERE imageId = $1", [productId]);
                    await this.cartItemRepository.delete({product_id: productId});
                    await this.productGateway.sendProductUpdate(productId, {deletedId: productId});
                    return {success: true, message: `Товар с id ${productId} успешно удален`};
                } else if (action === "change_price") {
                    let newPrice = data["newPrice"];

                    if (newPrice.includes(',')) {
                        newPrice = newPrice.replace(',', '.');
                    }

                    await this.productRepository.query("UPDATE Products SET price = $1 WHERE productId = $2", [newPrice, productId]);
                    await this.productGateway.sendProductUpdate(productId, {price: newPrice});

                    return {
                        success: true,
                        message: `Цена товара с id ${productId} успешно изменена на ${newPrice}`
                    };
                } else if (action === "change_category") {
                    const newCategory = data["newCategory"];
                    await this.productRepository.query("UPDATE Products SET category = $1 WHERE productId = $2", [newCategory, productId]);
                    await this.productGateway.sendProductUpdate(productId, {category: newCategory});
                    return {
                        success: true,
                        message: `Категория товара с id ${productId} успешно изменена на ${newCategory}`
                    };
                } else if (action === "change_brand") {
                    const newBrand = data["newBrand"];
                    await this.productRepository.query("UPDATE Products SET brand = $1 WHERE productId = $2", [newBrand, productId]);
                    await this.productGateway.sendProductUpdate(productId, {brand: newBrand});
                    return {
                        success: true,
                        message: `Бренд товара с id ${productId} успешно изменен на ${newBrand}`
                    };
                } else if (action === "change_count") {
                    const newCount = data["newCount"];
                    if (newCount == "0"){
                        await this.productRepository.query("UPDATE Products SET count = $1, availability = $2 WHERE productId = $3", [newCount, false, productId]);
                    } else {
                        await this.productRepository.query("UPDATE Products SET count = $1, availability = $2 WHERE productId = $3", [newCount, true, productId]);
                    }

                    const cart_items_to_edit = await this.cartItemRepository.findBy({product_id: productId});
                    cart_items_to_edit.forEach((item) => {
                        if (item.quantity > parseInt(newCount)) {
                            this.cartItemRepository.update({cart_item_id: item.cart_item_id}, {quantity: newCount});
                        }
                    })

                    await this.productGateway.sendProductUpdate(productId, {count: newCount});
                    return {
                        success: true,
                        message: `Количество товара с id ${productId} успешно изменено на ${newCount}`
                    };
                }
            } catch (error) {
                console.error(error);
                await this.productRepository.query('ROLLBACK');
                return {success: false, error: 'Internal Server Error'};
            }
        } else if ('cart_id' in data) {
            const cart_id = data["cart_id"];
            try {
                const products = await this.productRepository.query("SELECT * FROM Products ORDER BY ProductId");

                const cartItems = await this.cartItemRepository.query(`SELECT *
                                                                       FROM cart_items
                                                                       WHERE cart_id = $1`, [cart_id]);

                for (const product of products) {
                    for (const cartItem of cartItems) {
                        if (product.productid === cartItem.product_id) {
                            product["cart_item_id"] = cartItem.cart_item_id;
                            product["quantity"] = cartItem.quantity;
                            break;
                        }
                    }
                }

                return {success: true, products};
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Internal Server Error'};
            }
        }

    }

    async getProduct(product_id: number): Promise<any> {
        try {
            const products = await this.productRepository.query('SELECT * FROM Products WHERE ProductID = $1', [product_id]);
            const product = products[0];
            return {success: true, product};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Попробуйте ещё раз'};
        }
    }

    async addRate(data): Promise<any> {


        const requiredKeys = ["id", "myRating"];

        if (requiredKeys.every(key => key in data)) {
            const productId = data['id'];
            const myRating = parseFloat(data['myRating']);


            try {
                const product = await this.productRepository.findOneBy({productid: productId});

                if (product) {
                    let {rating, ratingcount} = product;
                    const sumRates = rating * ratingcount;
                    ratingcount += 1;
                    const newRating = parseFloat(((sumRates + myRating) / ratingcount).toFixed(2));

                    await this.productRepository.update(productId, {rating: newRating, ratingcount});

                    return {success: true, message: "Оценка успешно добавлена!"};
                } else {
                    return {success: false, error: 'Продукт не найден'};
                }
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Произошла ошибка при выполнении запроса'};
            }
        } else {
            return {success: false, error: 'Недостаточно данных для выполнения запроса'};
        }
    }

    async search(search_term: string): Promise<any> {
        const query = `
            SELECT *
            FROM products
            WHERE name ILIKE $1
               OR description ILIKE $2
               OR category ILIKE $3
               OR brand ILIKE $4
            ORDER BY productId;
        `;

        const products = await this.productRepository.query(query, [`%${search_term}%`, `%${search_term}%`, `%${search_term}%`, `%${search_term}%`]);
        if (products.length > 0) {
            return {'success': true, products};
        } else {
            return {'success': true, message: "По вашему запросу ничего не найдено!"};
        }
    }
}