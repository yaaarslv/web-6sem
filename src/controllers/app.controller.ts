import {Controller, Get, HttpStatus, Post, Req, Res} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {Response} from 'express';
import {AppService} from '../app.service';
import {CartItemService} from "../services/cartItemService";
import {CartService} from "../services/cartService";
import {NewsService} from "../services/newsService";
import {ProductService} from "../services/productService";
import {ReviewService} from "../services/reviewService";
import {UserService} from "../services/userService";
import {SubscribeService} from "../services/subscribeService";
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('app')
@Controller("/app")
export class AppController {
    constructor(private appService: AppService) {
    }

    @Get('/loadingTime')
    @ApiOperation({summary: 'Get total loading time'})
    @ApiResponse({status: 200, description: 'Returns total loading time'})
    getLoadingTime() {
        return this.appService.getTotalRequestTime();
    }

    @Get()
    @ApiOperation({summary: 'Redirect to index'})
    @ApiResponse({status: 200, description: 'Redirects to index'})
    root(@Res() res: Response) {
        return res.redirect("index");
    }

    @Post("/send_code")
    @ApiOperation({summary: 'Send code'})
    @ApiBody({
            schema: {
                properties: {
                    recipient: {description: 'Recipient email', type: 'string'}
                }
            }
        }
    )
    @ApiResponse({status: 200, description: 'Code has been successfully sent'})
    @ApiResponse({status: 400, description: 'Invalid recipient or other error'})
    async send_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendCode(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/send_recover_code")
    @ApiOperation({summary: 'Send recover code'})
    @ApiBody({
            schema: {
                properties: {
                    recipient: {description: 'Recipient email', type: 'string'}
                }
            }
        }
    )
    @ApiResponse({status: 200, description: 'Recover code has been successfully sent'})
    @ApiResponse({status: 400, description: 'Invalid recipient or other error'})
    async send_recover_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendRecoverCode(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/check_recover_code")
    @ApiOperation({summary: 'Check recovery code'})
    @ApiBody({
        schema: {
            properties: {
                email: {type: 'string'},
                code: {type: 'string'},
            },
        },
    })
    @ApiResponse({status: 200, description: 'Recovery code is valid'})
    @ApiResponse({status: 400, description: 'Invalid email, recovery code or other error'})
    async check_recover_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.checkRecoverCode(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Get(':pageName')
    @ApiOperation({summary: 'Get page by name'})
    @ApiParam({name: 'pageName', type: 'string'})
    @ApiResponse({status: 200})
    dynamicPage(@Res() res: Response) {
        const pageName = res.req.params.pageName;
        return res.render(pageName);
    }
}
