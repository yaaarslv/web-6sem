import {ApiBody, ApiOAuth2, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {NewsService} from "../services/newsService";
import {PostManageNewsDTO} from "../dto/postManageNewsDTO";

@ApiTags('news')
@Controller("/news")
export class NewsController {
    constructor(private newsService: NewsService){};

    @Get("/getNews")
    @ApiOperation({summary: 'Get all news'})
    @ApiResponse({status: 200, description: 'Returns all news'})
    async getManageNews(@Res() res: Response): Promise<any> {
        var result = await this.newsService.getManageNews();
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/postNews")
    @ApiOAuth2(['news:write'])
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
    async postManageNews(@Body() postManageNews: PostManageNewsDTO, @Res() res: Response): Promise<any> {
        var result = await this.newsService.postManageNews(postManageNews);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}