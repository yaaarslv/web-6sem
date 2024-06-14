import {IsNotEmpty, IsString} from "class-validator";

export class ChangeQuantityDTO {
    @IsNotEmpty()
    @IsString()
    cartProductId: string;

    @IsNotEmpty()
    @IsString()
    newQuantity: string;
}