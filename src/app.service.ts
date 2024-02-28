import {Injectable} from '@nestjs/common';
import {Email} from './models/Email';
import {randomInt} from 'crypto';
import {User} from "./models/User";
import * as path from "path";
import {Response} from "express";

const {Client} = require('pg');

let bcrypt = require('bcrypt');

@Injectable()
export class AppService {
    private emailHandler: Email;
    private client: any;

    constructor() {
        this.client = new Client({
            database: 'neondb',
            user: 'yaaarslv',
            password: 'bC4ZAwVvoU0u',
            host: 'ep-young-mode-85085940.us-west-2.aws.neon.tech',
            ssl: true
        });
    }

    getViewName(pageName: string): string {
        return pageName;
    }

    sendCodeToEmail(recipient: string): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для регистрации на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    sendRecoverCodeToEmail(recipient: string): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для восстановления пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addRecoverConfirmationCode(code, recipient);
    }

    sendMessageAboutSubscription(recipient: string): void {
        const subject = 'Благодарим за подписку!';
        const text = 'Вы успешно подписались на уведомления от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutUnsubscription(recipient: string): void {
        const subject = 'Отмена подписки';
        const text = 'Вы успешно отписались от рассылки уведомлений от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutNewPassword(recipient: string): void {
        const subject = 'Смена пароля';
        const text = 'Вы успешно сменили пароль на сайте Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageToSubscribers(subject: string, text: string, recipients: string[]): void {
        const unsubscribeLink = 'https://yaaarslv.github.io/Beb-web/cancel-subscription.html';
        const messageText = `${text}\n\nВы получили это письмо, потому что подписались на рассылку от сайта Petshop. Если вы больше не хотите получать эти уведомления, перейдите по ссылке ${unsubscribeLink}`;
        recipients.forEach(recipient => {
            try {
                this.emailHandler.sendMail(subject, recipient, messageText);
            } catch (e) {
                console.log(e);
            }
        });
    }

    sendNewPasswordConfirmationCode(recipient: string): void {
        const subject = 'Код подтверждения для сброса пароля';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для сброса пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }

    async addConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            await this.client.query('BEGIN');
            await this.client.query('INSERT INTO ConfirmationCodes (code, recipient_email) VALUES ($1, $2)', [code, recipientEmail]);
            await this.client.query('COMMIT');
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            await this.client.end();
        }
    }

    async addRecoverConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            await this.client.query('BEGIN');
            await this.client.query('INSERT INTO RecoverConfirmationCodes (code, recipient_email) VALUES ($1, $2)', [code, recipientEmail]);
            await this.client.query('COMMIT');
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            await this.client.end();
        }
    }

    async checkConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            const result = await this.client.query('SELECT Id FROM ConfirmationCodes WHERE code = $1 AND recipient_email = $2', [code, recipientEmail]);
            if (result.rows.length > 0) {
                await this.client.query('BEGIN');
                await this.client.query('DELETE FROM ConfirmationCodes WHERE Id = $1', [result.rows[0].id]);
                await this.client.query('COMMIT');
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            await this.client.end();
        }
    }

    async checkRecoverConfirmationCode(code, recipientEmail) {
        try {
            await this.connect();
            const result = await this.client.query('SELECT Id FROM RecoverConfirmationCodes WHERE code = $1 AND recipient_email = $2', [code, recipientEmail]);
            if (result.rows.length > 0) {
                await this.client.query('BEGIN');
                await this.client.query('DELETE FROM RecoverConfirmationCodes WHERE Id = $1', [result.rows[0].id]);
                await this.client.query('COMMIT');
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            await this.client.end();
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
        } finally {
            await this.client.end();
        }
    }

    async login(data): Promise<any> {
        if ('email' in data && 'password' in data) {
            const {email, password} = data;
            let correctEmail = "";

            try {
                await this.connect();

                const usersQuery = await this.client.query('SELECT * FROM Users');
                const usersDb = usersQuery.rows;

                const users: User[] = usersDb.map(user => new User(
                    user.email,
                    user.password,
                    user.role
                ));

                for (const user of users) {
                    if (email === user.email && bcrypt.compareSync(password, user.password)) {
                        correctEmail = email;
                        break;
                    }
                }

                if (correctEmail !== "") {
                    const result = await this.client.query('SELECT * FROM Users WHERE email = $1', [correctEmail]);
                    const userData = result.rows[0];

                    const cartIdQuery = await this.client.query('SELECT cart_id FROM Carts WHERE user_id = $1', [userData.id]);
                    const cartId = cartIdQuery.rows[0].cart_id;

                    this.client.end();

                    const token = userData.token;
                    const role = userData.role;
                    const isBanned = userData.is_banned;
                    const emailConfirmed = userData.emailconfirmed;

                    return {
                        success: true,
                        token,
                        role,
                        isBanned,
                        emailConfirmed,
                        cart_id: cartId
                    };
                }
            } catch (error) {
                console.error('Error:', error);
                return {success: false, error: 'Ошибка сервера'};
            }
        }

        return {success: false, error: 'Неверные учетные данные'};
    }

    async getManageProducts(): Promise<any> {
        await this.client.connect();

        try {
            const cursor = await this.client.query("SELECT * FROM Products ORDER BY ProductId");
            const products_db = cursor.rows;
            const products = products_db.map(product => ({
                id: product.productid,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                brand: product.brand,
                imageURL: product.imageurl,
                availability: product.availability,
                rating: product.rating,
                count: product.count,
                addedBy: product.addedby
            }));

            return {success: true, products};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Internal Server Error'};
        } finally {
            this.client.end();
        }

    }

    async postManageProducts(req: Request): Promise<any> {
        const data = req.body;

        if ('productId' in data && 'action' in data) {
            const productId = data['productId'];
            const action = data['action'];

            try {
                if (action === "change_name") {
                    const newName = data['newName'];
                    await this.client.query("UPDATE Products SET name = $1 WHERE productId = $2", [newName, productId]);
                    return {success: true, message: `Название товар с id ${productId} изменено на ${newName}`};
                } else if (action === "delete_product") {
                    await this.client.query("DELETE FROM Products WHERE productId = $1", [productId]);
                    await this.client.query("DELETE FROM Images WHERE imageId = $1", [productId]);
                    return {success: true, message: `Товар с id ${productId} успешно удален`};
                } else if (action === "change_price") {
                    let newPrice = data["newPrice"];

                    if (newPrice.includes(',')) {
                        newPrice = newPrice.replace(',', '.');
                    }

                    await this.client.query("UPDATE Products SET price = $1 WHERE productId = $2", [newPrice, productId]);
                    return {
                        success: true,
                        message: `Цена товара с id ${productId} успешно изменена на ${newPrice}`
                    };
                } else if (action === "change_category") {
                    const newCategory = data["newCategory"];
                    await this.client.query("UPDATE Products SET category = $1 WHERE productId = $2", [newCategory, productId]);
                    return {
                        success: true,
                        message: `Категория товара с id ${productId} успешно изменена на ${newCategory}`
                    };
                } else if (action === "change_brand") {
                    const newBrand = data["newBrand"];
                    await this.client.query("UPDATE Products SET brand = $1 WHERE productId = $2", [newBrand, productId]);
                    return {
                        success: true,
                        message: `Бренд товара с id ${productId} успешно изменен на ${newBrand}`
                    };
                } else if (action === "change_count") {
                    const newCount = data["newCount"];
                    await this.client.query("UPDATE Products SET count = $1 WHERE productId = $2", [newCount, productId]);
                    return {
                        success: true,
                        message: `Количество товара с id ${productId} успешно изменено на ${newCount}`
                    };
                } else if (action === "change_image") {
                    try {
                        var imagefile = null;
                        req.formData().then(data => function () {
                            imagefile = data["imagefile"]
                        });
                        if (imagefile) {
                            const filename = `${productId}${path.extname(imagefile.name)}`;
                            const imageBuffer = imagefile.data;
                            await this.client.query("UPDATE Images SET bytes = $1, extension = $2 WHERE imageid = $3", [imageBuffer, path.extname(imagefile.name), productId]);
                            return {success: true, message: `Фото товара с id ${productId} успешно изменено`};
                        } else {
                            return {success: false, error: 'Файл изображения не найден'};
                        }
                    } catch (error) {
                        console.error(error);
                        return {success: false, error: 'Ошибка сервера'};
                    }
                }
            } catch (error) {
                console.error(error);
                await this.client.query('ROLLBACK');
                return {success: false, error: 'Internal Server Error'};
            } finally {
                this.client.end();
            }
        } else if ('cart_id' in data) {
            const cart_id = data["cart_id"];
            try {
                const productsCursor = await this.client.query("SELECT * FROM Products ORDER BY ProductId");
                const products_db = productsCursor.rows;
                const products = products_db.map(product => ({
                    id: product.productid,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    brand: product.brand,
                    imageURL: product.imageurl,
                    availability: product.availability,
                    rating: product.rating,
                    count: product.count,
                    addedBy: product.addedby
                }));

                const cartItemsCursor = await this.client.query(`
                    SELECT cart_item_id, product_id, quantity
                    FROM cart_items
                    WHERE cart_id = $1;
                `, [cart_id]);

                const cartItems = cartItemsCursor.rows;

                for (const product of products) {
                    for (const cartItem of cartItems) {
                        if (product.id === cartItem.product_id) {
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
            } finally {
                this.client.end();
            }
        }

    }

    async getProduct(product_id: number): Promise<any> {
        await this.client.connect();
        try {
            const result = await this.client.query('SELECT * FROM Products WHERE ProductID = $1', [product_id]);
            const product_db = result.rows[0];
            const product = {
                id: product_db.productid,
                name: product_db.name,
                description: product_db.description,
                price: product_db.price,
                category: product_db.category,
                brand: product_db.brand,
                imageURL: product_db.imageurl,
                availability: product_db.availability,
                rating: product_db.rating,
                count: product_db.count,
                addedBy: product_db.addedby
            };
            return {success: true, product};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Попробуйте ещё раз'};
        } finally {
            this.client.end();
        }
    }

    async checkRole(req: Request): Promise<any> {
        await this.client.connect();

        try {
            const token = req.body["token"];

            if (!token) {
                return { success: false, error: 'Неправильный запрос' };
            }

            const userQuery = 'SELECT * FROM Users WHERE token = $1';
            const userValues = [token];
            const userResult = await this.client.query(userQuery, userValues);

            if (userResult.rows.length === 0) {
                return { success: false, error: 'Пользователь с таким токеном не найден' };
            }

            const userId = userResult.rows[0].id;
            const cartQuery = 'SELECT cart_id FROM Carts WHERE user_id = $1';
            const cartValues = [userId];
            const cartResult = await this.client.query(cartQuery, cartValues);

            const { role, isBanned, emailConfirmed } = userResult.rows[0];
            const cartId = cartResult.rows[0].cart_id;
            return {
                success: true,
                role,
                isBanned,
                emailConfirmed,
                cart_id: cartId,
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: 'Ошибка сервера' };
        } finally {
            this.client.end();
        }
    }
}
