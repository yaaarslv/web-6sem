import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,);
    var hbs = require('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'))

    const config = new DocumentBuilder()
        .setTitle('Petshop')
        .setDescription('The Petshop API description')
        .setVersion('1.0')
        .addOAuth2()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.set('view engine', 'hbs');
    app.set('views', join(__dirname, '..', 'views', 'layouts'));
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.useGlobalPipes(new ValidationPipe());
    app.use(session({
        secret: "wfeffpoefpofierfefjefjw0",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 600000
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.enableCors({
        origin: 'https://beb-web.onrender.com',
        methods: ['GET', 'POST'],
    });
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
