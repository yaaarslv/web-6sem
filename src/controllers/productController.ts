import {ApiBody, ApiOAuth2, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {ProductService} from "../services/productService";
import {PostManageProductsDTO} from "../dto/postManageProductsDTO";
import {AddRateDTO} from "../dto/addRateDTO";

@ApiTags('product')
@Controller("/product")
export class ProductController {
    constructor(private productService: ProductService){};

    @Get("/products")
    @ApiOperation({summary: 'Get all products'})
    @ApiResponse({status: 200, description: 'Returns all products'})
    async getManageProducts(@Res() res: Response): Promise<any> {
        var result = await this.productService.getManageProducts();
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/products")
    @ApiOAuth2(['products:write'])
    @ApiOperation({summary: 'Manage products'})
    @ApiBody({
        schema: {
            properties: {
                productId: {type: 'integer'},
                action: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async postManageProducts(@Body() postManageProducts: PostManageProductsDTO, @Res() res: Response): Promise<any> {
        var result = await this.productService.postManageProducts(postManageProducts);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Get('/product/:productId')
    @ApiOperation({summary: 'Get product by ID'})
    @ApiParam({name: 'productId', type: 'integer', description: 'Product ID'})
    @ApiResponse({status: 200, description: 'Product found'})
    @ApiResponse({status: 404, description: 'Product not found'})
    async getProduct(@Res() res: Response): Promise<any> {
        const productId = parseInt(res.req.params.productId);
        var result = await this.productService.getProduct(productId);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/addRate")
    @ApiOAuth2(['products:write'])
    @ApiOperation({summary: 'Add rating'})
    @ApiBody({
        schema: {
            properties: {
                id: {type: 'integer', description: 'Product id'},
                myRating: {type: 'integer', description: 'Your rating of this product'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Rating updated'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async addRate(@Body() addRate: AddRateDTO, @Res() res: Response): Promise<any> {
        var result = await this.productService.addRate(addRate);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Get('/search/:search_term')
    @ApiOperation({summary: 'Get product by search term'})
    @ApiParam({name: 'search_term', type: 'string'})
    @ApiResponse({status: 200, description: 'Products found'})
    @ApiResponse({status: 404, description: 'Products not found'})
    async search(@Res() res: Response): Promise<any> {
        const search_term = res.req.params.search_term;
        var result = await this.productService.search(search_term);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}