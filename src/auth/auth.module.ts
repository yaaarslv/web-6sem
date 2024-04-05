import { Module } from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {GoogleStrategy} from "./google.strategy";
import {AuthService} from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../models/User";
import {Serializer} from "./serializer";
import {Carts} from "../models/Carts";

@Module({
    imports: [TypeOrmModule.forFeature([Users, Carts])],
    providers: [GoogleStrategy,
        Serializer, {
        provide: 'AUTH_SERVICE',
        useClass: AuthService,
    }],
    exports: [],
    controllers: [AuthController]
})
export class AuthModule {

}