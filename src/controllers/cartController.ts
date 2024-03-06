import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Post, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {CartItemService} from "../services/cartItemService";

@ApiTags('cart')
@Controller("/cart")
export class CartController {
    constructor(private cartItemService: CartItemService){};

    @Post("/cart")
    @ApiOperation({summary: 'Get products from user cart'})
    @ApiBody({
        schema: {
            properties: {
                cart_id: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async cart(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.cart(req);
        res.json(result);
        return;
    }

    @Post("/changeQuantity")
    @ApiOperation({ summary: 'Change quantity' })
    @ApiBody({
        schema: {
            properties: {
                cartProductId: { type: 'string' },
                newQuantity: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Quantity changed successfully' })
    @ApiResponse({ status: 400, description: 'Error during operation' })
    async changeQuantity(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.changeQuantity(req);
        res.json(result);
        return;
    }

    @Post("/deleteCartProduct")
    @ApiOperation({summary: 'Remove product from user cart'})
    @ApiBody({
        schema: {
            properties: {
                cartProductId: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Product removed from cart successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async deleteCartProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.deleteCartProduct(req);
        res.json(result);
        return;
    }

    @Post("/addProductToCart")
    @ApiOperation({ summary: 'Add product to user cart' })
    @ApiBody({
        schema: {
            properties: {
                productId: { type: 'string' },
                cart_id: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Product added to cart successfully' })
    @ApiResponse({ status: 400, description: 'Error during operation' })
    async addProductToCart(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.addProductToCart(req);
        res.json(result);
        return;
    }
}