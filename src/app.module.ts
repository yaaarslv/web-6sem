import {MiddlewareConsumer, Module} from '@nestjs/common';
import {AppController} from './controllers/app.controller';
import {AppService} from './app.service';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TimingInterceptor} from './response-time.interceptor';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Products} from "./models/Products";
import {Users} from "./models/User";
import {Cart_items} from "./models/Cart_items";
import {Carts} from "./models/Carts";
import {Reviews} from "./models/Review";
import {News} from "./models/News";
import {Subscribers} from "./models/Subscribers";
import {CartItemService} from "./services/cartItemService";
import {NewsService} from "./services/newsService";
import {ProductService} from "./services/productService";
import {ReviewService} from "./services/reviewService";
import {SubscribeService} from "./services/subscribeService";
import {UserService} from "./services/userService";
import {CartController} from "./controllers/cartController";
import {NewsController} from "./controllers/newsController";
import {ProductController} from "./controllers/productController";
import {ReviewController} from "./controllers/reviewController";
import {SubscribeController} from "./controllers/subscribeController";
import {UserController} from "./controllers/userController";
import {AuthModule} from "./auth/auth.module";
import {PassportModule} from "@nestjs/passport";
import {UnauthorizedMiddleware} from "./unauthorized.middleware";
import {RequestMethod} from "@nestjs/common/enums";
import {AdminRoleMiddleware} from "./adminRole.middleware";
import {SuperadminRoleMiddleware} from "./superadminRoleMiddleware";
import {ProductGateway} from "./websockets/product.gateway";
import {UserGateway} from "./websockets/user.gateway";


@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([Users, Products, Cart_items, Carts, Reviews, News, Subscribers]),
        TypeOrmModule.forRoot({
            "type": "postgres",
            "ssl": true,
            "host": "ep-young-mode-85085940.us-west-2.aws.neon.tech",
            "username": "yaaarslv",
            "password": "bC4ZAwVvoU0u",
            "database": "neondb",
            "synchronize": true,
            "logging": false,
            "entities": [Users, Products, Cart_items, Carts, Reviews, News, Subscribers]
        }),
        PassportModule.register({session: true})
    ],
    controllers: [AppController, CartController, NewsController, ProductController, ReviewController, SubscribeController, UserController],
    providers: [
        AppService, CartItemService, NewsService, ProductService, ReviewService, SubscribeService, UserService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TimingInterceptor,
        },
        ProductGateway,
        UserGateway
    ],
    exports: [TypeOrmModule]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SuperadminRoleMiddleware)
            .forRoutes({path: '/user/users', method: RequestMethod.ALL}, '/user/addUser');

        consumer
            .apply(AdminRoleMiddleware)
            .forRoutes('/news/postNews');

        consumer
            .apply(UnauthorizedMiddleware)
            .forRoutes({path: '/user/users', method: RequestMethod.ALL}, '/cart', '/news/postNews', {path: '/product/products', method: RequestMethod.POST},
                '/product/addRate', '/review/postReviews', '/subscribe/subscript', '/subscribe/unsubscript' , '/user/addUser');
    }
}