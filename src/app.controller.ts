import {Controller, Get, HttpStatus, Post, Req, Res} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {Response} from 'express';
import {AppService} from './app.service';

@Controller()
export class AppController {
    constructor(private appService: AppService) {
    }

    @Get('/loadingTime')
    getLoadingTime() {
        return this.appService.getTotalRequestTime();
    }

    @Get()
    root(@Res() res: Response) {
        return res.render(
            this.appService.getViewName("index")
        );
    }

    @Get('/images/*')
    async serveImages(@Res() res): Promise<any> {
        const url = res.req.url;
        const filePath = path.join(__dirname, '..', 'public', url);

        try {
            const fileStream = fs.createReadStream(filePath);
            res.writeHead(200, {'Content-Type': 'application/octet-stream'});
            fileStream.pipe(res);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).send('File not found');
        }
    }

    @Get('/scripts/*')
    async serveScripts(@Res() res: Response): Promise<any> {
        const url = res.req.url;
        const filePath = path.join(__dirname, '..', 'public', url);

        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/javascript');
            res.status(HttpStatus.OK).send(fileContent);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).send('File not found');
        }
    }

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
        const data = req.body;
        var result = await this.appService.login(data);
        res.json(result);
        return;
    }

    @Get("/products")
    async getManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.getManageProducts();
        res.json(result);
        return;
    }

    @Post("/products")
    async postManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.postManageProducts(req);
        res.json(result);
        return;
    }

    @Get('/product/:productId')
    async getProduct(@Res() res: Response): Promise<any> {
        const productId = parseInt(res.req.params.productId);
        var result = await this.appService.getProduct(productId);
        res.json(result);
        return;
    }

    @Post("/checkRoleIsBanned")
    async checkRole(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.checkRole(req);
        res.json(result);
        return;
    }

    @Get(':pageName')
    dynamicPage(@Res() res: Response) {
        const pageName = res.req.params.pageName;
        return res.render(
            this.appService.getViewName(pageName)
        );
    }
}
