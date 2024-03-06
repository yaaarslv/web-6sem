import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,);
    var hbs = require('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'))

    app.set('view engine', 'hbs');
    app.set('views', join(__dirname, '..', 'views', 'layouts'));
    app.useStaticAssets(join(__dirname, '..', 'public'));

    await app.listen(3000);
}

bootstrap();
