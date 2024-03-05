import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TimingInterceptor} from './response-time.interceptor';
import {TypeOrmModule} from '@nestjs/typeorm';
// import {News} from "./models/News";
import {Products} from "./models/Products";
import {Users} from "./models/User";
import {Cart_items} from "./models/Cart_items";
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import * as express from 'express';
import {Carts} from "./models/Carts";
import {Reviews} from "./models/Review";


@Module({
    imports: [TypeOrmModule.forFeature([Users, Products, Cart_items, Carts, Reviews]),
        TypeOrmModule.forRoot({
            "type": "postgres",
            "ssl": true,
            "host": "ep-young-mode-85085940.us-west-2.aws.neon.tech",
            "username": "yaaarslv",
            "password": "bC4ZAwVvoU0u",
            "database": "neondb",
            "synchronize": false,
            "logging": false,
            "entities": [Users, Products, Cart_items, Carts, Reviews]
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TimingInterceptor,
        },
    ],
    exports: [TypeOrmModule]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(express.urlencoded({ extended: true })) // middleware для парсинга данных формы
            .forRoutes({ path: '/*', method: RequestMethod.ALL });
    }
}
