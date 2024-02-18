import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor() {}

  @Get('/styles/*')
  async serveStyles(@Res() res): Promise<any> {
    const url = res.req.url;
    const filePath = path.join(__dirname, '..', 'public', url);

    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/css');
      res.status(HttpStatus.OK).send(fileContent);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
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

  @Get('*')
  async serveHtml(@Res() res): Promise<any> {
    const url = res.req.url;

    const filePath = url.split('?')[0];


      const fullFilePath = path.join(__dirname, '..', 'public', filePath);
      try {
        const fileContent = await fs.promises.readFile(fullFilePath, 'utf8');
        res.status(HttpStatus.OK).send(fileContent);
      } catch (error) {
        res.status(HttpStatus.NOT_FOUND).send('File not found');
      }
  }
}
