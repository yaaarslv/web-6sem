import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class ChangeQuantityDTO {
    @IsNotEmpty()
    @IsString()
    cartProductId: string;

    @IsNotEmpty()
    @IsNumber()
    newQuantity: number;
}