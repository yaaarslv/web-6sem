import {PassportSerializer} from "@nestjs/passport";
import {Inject} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {Users} from "../models/User";

export class Serializer extends PassportSerializer {
    constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {
        super();
    }

    serializeUser(user: Users, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.user.id);
        return user ? done(null, user) : done(null, null);
    }
}