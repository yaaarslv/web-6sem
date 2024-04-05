import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UnauthorizedMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated()) {
            res.redirect('https://beb-web.onrender.com/app/auth');
        } else {
            next();
        }
    }
}