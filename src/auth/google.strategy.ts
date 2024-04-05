import {Inject, Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy} from 'passport-google-oauth20'
import {GOOGLE_CLIENT_ID, GOOGLE_SECRET} from "src/constants";
import {AuthService} from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject("AUTH_SERVICE") private authService: AuthService) {
        super({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_SECRET,
            callbackURL: 'https://beb-web.onrender.com/auth/google/redirect',
            scope: ['email', 'profile']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const user = await this.authService.validateUser({email: profile.emails[0].value, displayName: profile.displayName, email_verified: profile.emails[0].verified});
        return user || null;
    }
}