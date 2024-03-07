import {IsNotEmpty, IsString} from "class-validator";

export class AddProductToCartDTO {
    @IsNotEmpty()
    @IsString()
    cart_id: string;

    @IsNotEmpty()
    @IsString()
    productId: string;
}