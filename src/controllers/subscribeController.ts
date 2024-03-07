import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {SubscribeService} from "../services/subscribeService";
import {SubscriptDTO} from "../dto/subscriptDTO";

@ApiTags('subscribe')
@Controller("/subscribe")
export class SubscribeController {
    constructor(private subscribeService: SubscribeService){};

    @Post("/subscript")
    @ApiOperation({summary: 'Subscribe to notifications'})
    @ApiBody({
        schema: {
            properties: {
                email: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async subscript(@Body() subscript: SubscriptDTO, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.subscript(subscript);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/unsubscript")
    @ApiOperation({summary: 'Subscribe from notifications'})
    @ApiBody({
        schema: {
            properties: {
                email: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async unsubscript(@Body() subscript: SubscriptDTO, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.unsubscript(subscript);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}