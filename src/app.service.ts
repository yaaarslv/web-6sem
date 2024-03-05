import {Injectable} from '@nestjs/common';
import {Email} from './models/Email';
import {randomInt} from 'crypto';
import {Users} from "./models/User";
import * as path from "path";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Products} from "./models/Products";
import {Cart_items} from "./models/Cart_items";
import {Carts} from "./models/Carts";
import {Reviews} from "./models/Review";

const {Client} = require('pg');

let bcrypt = require('bcrypt');


@Injectable()
export class AppService {
    private emailHandler: Email;
    private client: any;
    private requestTimes: number[] = [];

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
                @InjectRepository(Products) private productRepository: Repository<Products>,
                @InjectRepository(Cart_items) private cartItemRepository: Repository<Cart_items>,
                @InjectRepository(Carts) private cartsRepository: Repository<Carts>,
                @InjectRepository(Reviews) private reviewRepository: Repository<Reviews>) {
        this.client = new Client({
            database: 'neondb',
            user: 'yaaarslv',
            password: 'bC4ZAwVvoU0u',
            host: 'ep-young-mode-85085940.us-west-2.aws.neon.tech',
            ssl: true
        });
        this.emailHandler = new Email('petshop-yaarslv@yandex.ru');
    }

    public addRequestTime(time: number): void {
        this.requestTimes.push(time);
    }

    public getTotalRequestTime(): number {
        const sum = this.requestTimes.reduce((total, time) => total + time, 0);
        this.requestTimes = [];
        return sum;
    }

    sendCodeToEmail(recipient): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для регистрации на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    sendRecoverCodeToEmail(recipient): void {
        const subject = 'Код подтверждения';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для восстановления пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addRecoverConfirmationCode(code, recipient);
    }

    sendMessageAboutSubscription(recipient): void {
        const subject = 'Благодарим за подписку!';
        const text = 'Вы успешно подписались на уведомления от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutUnsubscription(recipient): void {
        const subject = 'Отмена подписки';
        const text = 'Вы успешно отписались от рассылки уведомлений от сайта Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageAboutNewPassword(recipient): void {
        const subject = 'Смена пароля';
        const text = 'Вы успешно сменили пароль на сайте Petshop';
        this.emailHandler.sendMail(subject, recipient, text);
    }

    sendMessageToSubscribers(subject, text, recipients: string[]): void {
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

    sendNewPasswordConfirmationCode(recipient): void {
        const subject = 'Код подтверждения для сброса пароля';
        const code = randomInt(100000, 999999);
        const text = `Ваш код подтверждения для сброса пароля на сайте Petshop: ${code}`;
        this.emailHandler.sendMail(subject, recipient, text);
        this.addConfirmationCode(code, recipient);
    }

    async connect() {
        try {
            await this.client.connect();
        } catch {
            console.error('Error');
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
            // await this.client.end();
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
            // await this.client.end();
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
            // await this.client.end();
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
            // await this.client.end();
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
            // await this.client.end();
        }
    }


    async login(data): Promise<any> {
        if ('email' in data && 'password' in data) {
            await this.connect();

            const {email, password} = data;

            try {
                const user = await this.userRepository.query(`SELECT *
                                                              FROM Users
                                                              WHERE email = $1`, [email]);
                if (user && bcrypt.compareSync(password, user[0].password)) {

                    const cart_id_db = await this.cartsRepository.findOneBy({user_id: user[0].id})
                    var cart_id = cart_id_db.cart_id

                    const {token, role, is_banned, emailconfirmed} = user[0];
                    return {success: true, token, role, is_banned, emailconfirmed, cart_id};
                } else {
                    return {success: false, error: 'Неверные учетные данные'};
                }
            } catch (error) {
                console.error('Error:', error);
                return {success: false, error: 'Ошибка сервера'};
            }
        }

        return {success: false, error: 'Переданы не все параметры!'};
    }

    async getManageProducts(): Promise<any> {
        // await this.connect();

        try {
            const products = await this.userRepository.query("SELECT * FROM Products ORDER BY ProductId");
            return {success: true, products};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Internal Server Error'};
        } finally {
            // await this.client.end();
        }

    }

    async postManageProducts(req: Request): Promise<any> {
        var data = req.body;

        // await this.connect();

        if ('productId' in data && 'action' in data) {
            const productId = data['productId'];
            const action = data['action'];

            try {
                if (action === "change_name") {
                    const newName = data['newName'];
                    await this.productRepository.query("UPDATE Products SET name = $1 WHERE productId = $2", [newName, productId]);
                    return {success: true, message: `Название товар с id ${productId} изменено на ${newName}`};
                } else if (action === "delete_product") {
                    await this.productRepository.query("DELETE FROM Products WHERE productId = $1", [productId]);
                    await this.productRepository.query("DELETE FROM Images WHERE imageId = $1", [productId]);
                    return {success: true, message: `Товар с id ${productId} успешно удален`};
                } else if (action === "change_price") {
                    let newPrice = data["newPrice"];

                    if (newPrice.includes(',')) {
                        newPrice = newPrice.replace(',', '.');
                    }

                    await this.productRepository.query("UPDATE Products SET price = $1 WHERE productId = $2", [newPrice, productId]);
                    return {
                        success: true,
                        message: `Цена товара с id ${productId} успешно изменена на ${newPrice}`
                    };
                } else if (action === "change_category") {
                    const newCategory = data["newCategory"];
                    await this.productRepository.query("UPDATE Products SET category = $1 WHERE productId = $2", [newCategory, productId]);
                    return {
                        success: true,
                        message: `Категория товара с id ${productId} успешно изменена на ${newCategory}`
                    };
                } else if (action === "change_brand") {
                    const newBrand = data["newBrand"];
                    await this.productRepository.query("UPDATE Products SET brand = $1 WHERE productId = $2", [newBrand, productId]);
                    return {
                        success: true,
                        message: `Бренд товара с id ${productId} успешно изменен на ${newBrand}`
                    };
                } else if (action === "change_count") {
                    const newCount = data["newCount"];
                    await this.productRepository.query("UPDATE Products SET count = $1 WHERE productId = $2", [newCount, productId]);
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
                            await this.productRepository.query("UPDATE Images SET bytes = $1, extension = $2 WHERE imageid = $3", [imageBuffer, path.extname(imagefile.name), productId]);
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
                await this.productRepository.query('ROLLBACK');
                return {success: false, error: 'Internal Server Error'};
            } finally {
                // await this.client.end();
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
            } finally {
                // await this.client.end();
            }
        }

    }

    async getProduct(product_id: number): Promise<any> {
        await this.connect();
        try {
            const products = await this.productRepository.query('SELECT * FROM Products WHERE ProductID = $1', [product_id]);
            const product = products[0];
            return {success: true, product};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Попробуйте ещё раз'};
        } finally {
            // await this.client.end();
        }
    }

    async checkRole(req: Request): Promise<any> {
        await this.connect();

        try {
            const token = req.body["token"];

            if (!token) {
                return {success: false, error: 'Неправильный запрос'};
            }

            const userResult = await this.userRepository.query('SELECT * FROM Users WHERE token = $1', [token]);

            if (userResult.length === 0) {
                return {success: false, error: 'Пользователь с таким токеном не найден'};
            }

            const userId = userResult[0].id;
            const cartQuery = 'SELECT cart_id FROM Carts WHERE user_id = $1';
            const cartValues = [userId];
            const cartResult = await this.client.query(cartQuery, cartValues);

            const role = userResult[0].role;
            const isBanned = userResult[0].is_banned;
            const emailConfirmed = userResult[0].emailconfirmed;
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
            return {success: false, error: 'Ошибка сервера'};
        } finally {
            // await this.client.end();
        }
    }

    async addRate(req: Request): Promise<any> {
        const data = req.body;

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

    async sendCode(req: Request): Promise<any> {
        const data = req.body;

        if ('recipient' in data) {
            const recipient = data['recipient'];

            try {
                this.sendCodeToEmail(recipient);
                return {'success': true, 'message': 'Код отправлен!'};
            } catch (error) {
                console.log(error)
                return {'success': false, 'error': "Произошла ошибка"};
            }
        }

        return {'success': false, 'error': 'Переданы не все параметры!'};
    }

    async sendRecoverCode(req: Request): Promise<any> {
        const data = req.body;

        if ('recipient' in data) {
            const recipient = data['recipient'];

            try {
                this.sendRecoverCodeToEmail(recipient);
                return {'success': true, 'message': 'Код отправлен!'};
            } catch (error) {
                console.log(error)
                return {'success': false, 'error': "Произошла ошибка"};
            }
        }

        return {'success': false, 'error': 'Переданы не все параметры!'};
    }

    async checkRecoverCode(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["email", "code"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const code = data['code'];

            const result = this.checkRecoverConfirmationCode(code, email);
            if (!result) {
                return {'success': false, 'error': 'Неверный код подтверждения!'};
            }
            const user = this.userRepository.findOneBy({email: email});
            if (user) {
                return {'success': true, 'email': email};
            }
            return {'success': false, 'error': 'Пользователя с такой почтой не существует!'};
        }
        return {'success': false, 'error': 'Неверные учетные данные'};

    }

    async changePassword(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["email", "password"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const newPassword = data['password'];

            try {
                const user = await this.userRepository.findOneBy({email: email});
                if (!user) {
                    return {success: false, message: 'Пользователь с указанным email не найден'};
                }

                user.password = await bcrypt.hash(newPassword, 10);
                await this.userRepository.save(user);
                this.sendMessageAboutNewPassword(email);

                return {success: true, message: 'Пароль успешно изменён'};
            } catch (error) {
                console.error(error);
                return {success: false, message: 'Произошла ошибка при изменении пароля'};
            }
        }
    }

    async register(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["email", "password", "code"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const password = data['password'];
            const code = data['code'];

            const confirmationResult = await this.checkConfirmationCode(code, email);
            if (!confirmationResult) {
                return {success: false, error: 'Неверный код подтверждения'};
            }

            const existingUser = await this.userRepository.findOneBy({email: email});
            if (existingUser) {
                return {success: false, error: 'Пользователь с таким email уже существует'};
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = this.userRepository.create({
                email: email,
                password: hashedPassword,
                role: 'User'
            });

            try {
                const newCart = this.cartsRepository.create({user_id: newUser.id});

                return {
                    success: true,
                    token: newUser.token,
                    role: newUser.role,
                    isBanned: newUser.is_banned,
                    emailConfirmed: newUser.emailconfirmed,
                    cart_id: newCart.cart_id
                };
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Произошла ошибка при регистрации'};
            }
        }
        return {success: false, error: 'Недостаточные данные для регистрации'};
    }

    async addUser(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["email", "password"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const password = data['password'];

            const existingUser = await this.userRepository.findOneBy({email: email});
            if (existingUser) {
                return {success: false, error: 'Пользователь с таким email уже существует'};
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = this.userRepository.create({
                email: email,
                password: hashedPassword,
                role: 'User',
                emailconfirmed: false
            });

            try {
                const newCart = this.cartsRepository.create({user_id: newUser.id});

                return {
                    success: true,
                    token: newUser.token,
                    role: newUser.role,
                    isBanned: newUser.is_banned,
                    emailConfirmed: newUser.emailconfirmed,
                    cart_id: newCart.cart_id
                };
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Произошла ошибка при регистрации'};
            }
        }
    }

    async getManageUsers(): Promise<any> {
        return this.userRepository
            .createQueryBuilder('user')
            .orderBy('LENGTH(user.role)', 'DESC')
            .getMany();
    }

    async postManageUsers(req: Request): Promise<any> {
        const data = req.body;

        if ('userId' in data && 'action' in data) {
            const userId = data['userId'];
            const action = data['action'];

            if (action === 'change_role') {
                try {
                    const newRole = data['newRole'];
                    await this.userRepository.query("UPDATE Users SET role = $1 WHERE id = $2", [newRole, userId]);

                    return {
                        success: true,
                        message: `Роль пользователя с id ${userId} успешно изменена на ${newRole}`,
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        success: false,
                        error: 'Попробуйте ещё раз',
                    };
                }
            } else if (action === 'delete_user') {
                try {
                    await this.userRepository.query("DELETE FROM Users WHERE Id = $1", [userId]);

                    return {
                        success: true,
                        message: `Пользователь с id ${userId} успешно удалён`,
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        success: false,
                        error: 'Попробуйте ещё раз',
                    };
                }
            } else if (action === 'change_user_is_banned') {
                try {
                    const isBanned = data['isBanned'];
                    await this.userRepository.query("UPDATE Users SET is_banned = $1 WHERE id = $2", [isBanned, userId]);

                    return {
                        success: true,
                        message: `Бан пользователя с id ${userId} изменён на ${isBanned}`,
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        success: false,
                        error: 'Попробуйте ещё раз',
                    };
                }
            } else if (action === 'change_email_confirmed') {
                try {
                    const emailConfirmed = data['emailConfirmed'];
                    await this.userRepository.query("UPDATE Users SET emailconfirmed = $1 WHERE id = $2", [emailConfirmed, userId]);

                    return {
                        success: true,
                        message: `Почта пользователя с id ${userId} подтверждена: ${emailConfirmed}`,
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        success: false,
                        error: 'Попробуйте ещё раз',
                    };
                }
            }
        } else {
            return {
                success: false,
                error: 'Отсутствуют необходимые данные'
            };
        }
    }

    async getManageReviews(): Promise<any> {
        try {
            const reviews = await this.reviewRepository.find();
            return {success: true, reviews};
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Ошибка при получении отзывов'};
        }
    }

    async postManageReviews(req: Request): Promise<any> {
        const data = req.body;

        const requiredKeys = ["author", "text"];

        if (requiredKeys.every(key => key in data)) {
            const author = data['author'];
            const text = data['text'];

            try {
                this.reviewRepository.create({author: author, text: text});
                return {success: true, message: 'Отзыв успешно добавлен'};
            } catch (error) {
                console.error(error);
                return {success: false, error: 'Ошибка при добавлении отзыва'};
            }
        }

    }
}


//    @app.route("/users", methods=["GET", "POST"])
// def manage_users():
//     # global connection
//     # if connection.closed:
//     connection = open_connection()
//
//     elif request.method == "POST":
//         data = request.json
//         if 'userId' in data:
//             userId = data['userId']
//             action = data['action']
//             if action == "change_role":
//                 try:
//                     newRole = data['newRole']
//                     cursor = connection.cursor()
//                     cursor.execute("UPDATE Users SET role = %s WHERE id = %s", (newRole, userId))
//                     connection.commit()
//                     cursor.close()
//                     return jsonify(
//                         {'success': True, 'message': f"Ð Ð¾Ð»Ñ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ Ñ id {userId} Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð° Ð½Ð° {newRole}"})
//
//                 except Exception as e:
//                     print(e)
//                     connection.rollback()
//                     return jsonify({'success': False, 'error': 'ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÐµÑÑ ÑÐ°Ð·'})
//
//                 finally:
//                     connection.close()
//
//             elif action == "delete_user":
//                 try:
//                     cursor = connection.cursor()
//                     cursor.execute("DELETE FROM Users WHERE Id = %s", (userId,))
//                     connection.commit()
//                     cursor.close()
//                     return jsonify({'success': True, 'message': f"ÐÐ¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ Ñ id {userId} ÑÑÐ¿ÐµÑÐ½Ð¾ ÑÐ´Ð°Ð»ÑÐ½"})
//
//                 except Exception as e:
//                     print(e)
//                     connection.rollback()
//                     return jsonify({'success': False, 'error': 'ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÐµÑÑ ÑÐ°Ð·'})
//
//                 finally:
//                     connection.close()
//
//             elif action == "change_user_is_banned":
//                 try:
//                     isBanned = data['isBanned']
//                     cursor = connection.cursor()
//                     cursor.execute("UPDATE Users SET is_banned = %s WHERE id = %s", (isBanned, userId))
//                     connection.commit()
//                     cursor.close()
//                     return jsonify(
//                         {'success': True, 'message': f"ÐÐ°Ð½ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ Ñ id {userId} Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½ Ð½Ð° {isBanned}"})
//
//                 except Exception as e:
//                     print(e)
//                     connection.rollback()
//                     return jsonify({'success': False, 'error': 'ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÐµÑÑ ÑÐ°Ð·'})
//
//                 finally:
//                     connection.close()
//
//             elif action == "change_email_confirmed":
//                 try:
//                     emailConfirmed = data['emailConfirmed']
//                     cursor = connection.cursor()
//                     cursor.execute("UPDATE Users SET emailConfirmed = %s WHERE id = %s", (emailConfirmed, userId))
//                     connection.commit()
//                     cursor.close()
//                     return jsonify({'success': True,
//                                     'message': f"ÐÐ¾ÑÑÐ° Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ Ñ id {userId} Ð¿Ð¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½Ð° Ð½Ð° {emailConfirmed}"})
//
//                 except Exception as e:
//                     print(e)
//                     connection.rollback()
//                     return jsonify({'success': False, 'error': 'ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÐµÑÑ ÑÐ°Ð·'})
//
//                 finally:
//                     connection.close()



