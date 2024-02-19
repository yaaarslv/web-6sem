import {Controller, Get, Res, Render, HttpStatus} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { AppService } from './app.service';

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

    // @Get('/styles/*')
    // async serveStyles(@Res() res): Promise<any> {
    //     const url = res.req.url;
    //     const filePath = path.join(__dirname, '..', 'public', url);
    //
    //     try {
    //         const fileContent = await fs.promises.readFile(filePath, 'utf8');
    //         res.setHeader('Content-Type', 'text/css');
    //         res.status(HttpStatus.OK).send(fileContent);
    //     } catch (error) {
    //         res.status(HttpStatus.NOT_FOUND).send('File not found');
    //     }
    // }


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
    async serveScripts(@Res() res): Promise<any> {
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

    // @Get(':page_name.html')
    // async serveHtml(@Res() res): Promise<any> {
    //     const pageName = res.req.params.page_name;
    //     const filePath = `${pageName}.html`;
    //     const fullFilePath = path.join(__dirname, '..', 'public', filePath);
    //
    //     try {
    //         const fileContent = await fs.promises.readFile(fullFilePath, 'utf8');
    //         res.status(HttpStatus.OK).send(fileContent);
    //     } catch (error) {
    //         const notFoundFilePath = path.join(__dirname, '..', 'public', '404.html');
    //         try {
    //             const notFoundFileContent = await fs.promises.readFile(notFoundFilePath, 'utf8');
    //             res.status(HttpStatus.NOT_FOUND).send(notFoundFileContent);
    //         } catch (error) {
    //             res.status(HttpStatus.NOT_FOUND).send('File not found');
    //         }
    //     }
    // }
}
