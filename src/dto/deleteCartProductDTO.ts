import {IsNotEmpty, IsString} from "class-validator";

export class DeleteCartProductDTO {
    @IsNotEmpty()
    @IsString()
    cartProductId: string;
}