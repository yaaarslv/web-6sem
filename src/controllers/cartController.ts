import {ApiBody, ApiOAuth2, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {CartItemService} from "../services/cartItemService";
import {CartDTO} from "../dto/cartDTO";
import {DeleteCartProductDTO} from "../dto/deleteCartProductDTO";
import {ChangeQuantityDTO} from "../dto/changeQuantityDTO";
import {AddProductToCartDTO} from "../dto/addProductToCartDTO";

@ApiTags('cart')
@Controller("/cart")
export class CartController {
    constructor(private cartItemService: CartItemService){};

    @Post("/cart")
    @ApiOAuth2(['carts:write'])
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
    async cart(@Body() cartDTO: CartDTO, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.cart(cartDTO);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/changeQuantity")
    @ApiOAuth2(['carts:write'])
    @ApiOperation({ summary: 'Change quantity' })
    @ApiBody({
        schema: {
            properties: {
                cartProductId: { type: 'string' },
                newQuantity: { type: 'integer' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Quantity changed successfully' })
    @ApiResponse({ status: 400, description: 'Error during operation' })
    async changeQuantity(@Body() changeQuantity: ChangeQuantityDTO, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.changeQuantity(changeQuantity);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/deleteCartProduct")
    @ApiOAuth2(['carts:write'])
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
    async deleteCartProduct(@Body() deleteCartProduct: DeleteCartProductDTO, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.deleteCartProduct(deleteCartProduct);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/addProductToCart")
    @ApiOAuth2(['carts:write'])
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
    async addProductToCart(@Body() addProductToCart: AddProductToCartDTO, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.addProductToCart(addProductToCart);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}