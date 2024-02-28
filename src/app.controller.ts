import {Controller, Get, Res, Render, HttpStatus, Post, Req} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { AppService } from './app.service';
import {User} from "./models/User";
import bcrypt from "bcrypt";

@Controller()
export class AppController {
    constructor(private appService: AppService) {}
    @Get()
    root(@Res() res: Response) {
        return res.render(
            this.appService.getViewName("index")
        );
    }

    @Get(':pageName')
    dynamicPage(@Res() res: Response) {
        const pageName = res.req.params.pageName;
        return res.render(
            this.appService.getViewName(pageName)
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

    @Post('/login/*')
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
        const data = req.body;
        return this.appService.login(data);
    }

    @Get("/products/*")
    async getManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        return this.appService.getManageProducts();
    }

    @Post("/products/*")
    async postManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        return this.appService.postManageProducts(req);
    }

    @Get('/product/:productId')
    async getProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
        const productId = parseInt(res.req.params.productId);
        return this.appService.getProduct(productId);
    }

    @Post("/checkRoleIsBanned")
    async checkRole(req: Request, res: Response): Promise<any> {
        return this.appService.checkRole(req);
    }
}
