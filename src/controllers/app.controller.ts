import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {AppService} from '../app.service';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {SendCodeDTO} from "../dto/sendCodeDTO";
import {CheckRecoverCodeDTO} from "../dto/checkRecoverCodeDTO";

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
    async send_code(@Body() sendCodeDto: SendCodeDTO, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendCode(sendCodeDto);
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
    async send_recover_code(@Body() sendCodeDto: SendCodeDTO, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendRecoverCode(sendCodeDto);
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
    async check_recover_code(@Body() checkRecoverCodeDTO: CheckRecoverCodeDTO, @Res() res: Response): Promise<any> {
        var result = await this.appService.checkRecoverCode(checkRecoverCodeDTO);
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
