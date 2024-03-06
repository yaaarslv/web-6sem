import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Post, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {NewsService} from "../services/newsService";

@ApiTags('news')
@Controller("/news")
export class NewsController {
    constructor(private newsService: NewsService){};

    @Get("/getNews")
    @ApiOperation({summary: 'Get all news'})
    @ApiResponse({status: 200, description: 'Returns all news'})
    async getManageNews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.newsService.getManageNews();
        res.json(result);
        return;
    }

    @Post("/postNews")
    @ApiOperation({summary: 'Add news'})
    @ApiBody({
        schema: {
            properties: {
                subject: {type: 'string'},
                text: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async postManageNews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.newsService.postManageNews(req);
        res.json(result);
        return;
    }
}