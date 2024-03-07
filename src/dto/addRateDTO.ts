import {IsNotEmpty, IsNumber} from "class-validator";

export class AddRateDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    myRating: number;
}