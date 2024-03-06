import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TimingInterceptor} from './response-time.interceptor';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Products} from "./models/Products";
import {Users} from "./models/User";
import {Cart_items} from "./models/Cart_items";
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import * as express from 'express';
import {Carts} from "./models/Carts";
import {Reviews} from "./models/Review";
import {News} from "./models/News";
import {Subscribers} from "./models/Subscribers";
import {CartService} from "./services/cartService";
import {CartItemService} from "./services/cartItemService";
import {NewsService} from "./services/newsService";
import {ProductService} from "./services/productService";
import {ReviewService} from "./services/reviewService";
import {SubscribeService} from "./services/subscribeService";
import {UserService} from "./services/userService";


@Module({
    imports: [TypeOrmModule.forFeature([Users, Products, Cart_items, Carts, Reviews, News, Subscribers]),
        TypeOrmModule.forRoot({
            "type": "postgres",
            "ssl": true,
            "host": "ep-young-mode-85085940.us-west-2.aws.neon.tech",
            "username": "yaaarslv",
            "password": "bC4ZAwVvoU0u",
            "database": "neondb",
            "synchronize": false,
            "logging": false,
            "entities": [Users, Products, Cart_items, Carts, Reviews, News, Subscribers]
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService, CartService, CartItemService, NewsService, ProductService, ReviewService, SubscribeService, UserService,
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
            .apply(express.urlencoded({ extended: true }))
            .forRoutes({ path: '/*', method: RequestMethod.ALL });
    }
}
