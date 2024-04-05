import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';

@Injectable()
export class AdminRoleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.user){
            const user = req.user;
            const role = user['role'];
            if (role != 'Admin' && role != 'Superadmin') {
                return res.status(403).send({ message: 'У вас нет прав для доступа к этому ресурсу' });
            } else {
                next();
            }
        } else {
            res.redirect('https://beb-web.onrender.com/app/auth');
        }
    }
}