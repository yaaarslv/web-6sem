import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Post, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {ReviewService} from "../services/reviewService";

@ApiTags('review')
@Controller("/review")
export class ReviewController {
    constructor(private reviewService: ReviewService){};

    @Get("/getReviews")
    @ApiOperation({summary: 'Get all reviews'})
    @ApiResponse({status: 200, description: 'Returns all reviews'})
    async getManageReviews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.reviewService.getManageReviews();
        res.json(result);
        return;
    }

    @Post("/postReviews")
    @ApiOperation({summary: 'Add review'})
    @ApiBody({
        schema: {
            properties: {
                author: {type: 'string'},
                text: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async postManageReviews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.reviewService.postManageReviews(req);
        res.json(result);
        return;
    }
}