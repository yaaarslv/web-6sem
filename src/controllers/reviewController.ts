import {ApiBody, ApiOAuth2, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {ReviewService} from "../services/reviewService";
import {PostManageReviewsDTO} from "../dto/postManageReviewsDTO";

@ApiTags('review')
@Controller("/review")
export class ReviewController {
    constructor(private reviewService: ReviewService){};

    @Get("/getReviews")
    @ApiOperation({summary: 'Get all reviews'})
    @ApiResponse({status: 200, description: 'Returns all reviews'})
    async getManageReviews(@Res() res: Response): Promise<any> {
        var result = await this.reviewService.getManageReviews();
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/postReviews")
    @ApiOAuth2(['reviews:write'])
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
    async postManageReviews(@Body() postManageReviews: PostManageReviewsDTO, @Res() res: Response): Promise<any> {
        var result = await this.reviewService.postManageReviews(postManageReviews);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}