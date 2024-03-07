import {IsNotEmpty, IsString} from "class-validator";

export class CartDTO {
    @IsNotEmpty()
    @IsString()
    cart_id: string;
}