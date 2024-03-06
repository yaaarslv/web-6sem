import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../models/User";
import {Repository} from "typeorm";
import {Carts} from "../models/Carts";
import {AppService} from "../app.service";
let bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    constructor(private appService: AppService,
                @InjectRepository(Users) private userRepository: Repository<Users>,
                @InjectRepository(Carts) private cartsRepository: Repository<Carts>) {
    }

    async login(data): Promise<any> {
        if ('email' in data && 'password' in data) {
            const {email, password} = data;

            try {
                const user = await this.userRepository.query(`SELECT *
                                                              FROM Users
                                                              WHERE email = $1`, [email]);
                if (user.length > 0 && bcrypt.compareSync(password, user[0].password)) {

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

    async checkRole(req: Request): Promise<any> {
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
            const cartResult = await this.cartsRepository.query(cartQuery, cartValues);

            const role = userResult[0].role;
            const isBanned = userResult[0].is_banned;
            const emailConfirmed = userResult[0].emailconfirmed;
            const cartId = cartResult[0].cart_id;
            return {
                success: true,
                role: role,
                is_banned: isBanned,
                emailconfirmed: emailConfirmed,
                cart_id: cartId,
            }
        } catch (error) {
            console.error(error);
            return {success: false, error: 'Ошибка сервера'};
        }
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
                this.appService.sendMessageAboutNewPassword(email);

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

            const confirmationResult = await this.appService.checkConfirmationCode(code, email);
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

            await this.userRepository.save(newUser);

            try {
                const newCart = this.cartsRepository.create({user_id: newUser.id});
                await this.cartsRepository.save(newCart);

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

            await this.userRepository.save(newUser);

            try {
                const newCart = this.cartsRepository.create({user_id: newUser.id});
                await this.cartsRepository.save(newCart);

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
        const users = await this.userRepository
            .createQueryBuilder('user')
            .orderBy('LENGTH(user.role)', 'DESC')
            .getMany();
        return {users}
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

    async confirmEmail(req: Request): Promise<any> {
        const data = req.body;
        const requiredKeys = ["email", "code"];

        if (requiredKeys.every(key => key in data)) {
            const email = data['email'];
            const code = data['code'];

            const result = await this.appService.checkConfirmationCode(code, email);
            if (!result) {
                return {'success': false, 'error': 'Неверный код подтверждения!'}
            } else {
                try {
                    await this.userRepository.update({email}, {emailconfirmed: true});
                } catch (error) {
                    console.log(error);
                    return {'success': false, 'error': 'Произошла ошибка'}
                }
                return {'success': true, 'emailConfirmed': true}
            }
        }
        return {'success': false, 'error': 'Переданы не все параметры'}
    }

}