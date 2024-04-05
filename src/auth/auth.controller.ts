import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, Req, Res, UseGuards} from "@nestjs/common";
import {GoogleAuthGuard} from "./guards";
import {Response} from "express";

@ApiTags('auth')
@Controller("/auth")
export class AuthController {
    @Get("/google/login")
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return {msg: 'Google Authentication'}
    }

    @Get("/google/redirect")
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Req() request, @Res() response: Response) {
        if (request.user){
            const user = request.user.user;
            const id = user.id;
            const email = user.email;
            const displayName = user.displayName;
            const token = user.token;
            const role = user.role;
            const is_banned = user.is_banned;
            const emailconfirmed = user.emailconfirmed;
            const cart_id = request.user.cart_id;
            response.redirect(`https://beb-web.onrender.com/app/index?id=${id}&email=${email}&displayName=${displayName}&token=${token}&role=${role}&is_banned=${is_banned}&emailconfirmed=${emailconfirmed}&cart_id=${cart_id}`);
        } else {
            response.redirect("https://beb-web.onrender.com/app/index");
        }
    }

    @Get("/status")
    user(@Req() request) {
        if (request.user){
            return {msg: "Authenticated"}
        } else {
            return {msg: "Unauthenticated"}
        }
    }
}
