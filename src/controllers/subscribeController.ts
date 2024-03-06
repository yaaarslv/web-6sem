import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Post, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {SubscribeService} from "../services/subscribeService";

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
    async subscript(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.subscript(req);
        res.json(result);
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
    async unsubscript(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.unsubscript(req);
        res.json(result);
        return;
    }
}