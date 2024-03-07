import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,);
    var hbs = require('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'))

    const config = new DocumentBuilder()
        .setTitle('Petshop')
        .setDescription('The Petshop API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.set('view engine', 'hbs');
    app.set('views', join(__dirname, '..', 'views', 'layouts'));
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}

bootstrap();
