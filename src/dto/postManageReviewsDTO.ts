import {IsNotEmpty, IsString} from "class-validator";

export class PostManageReviewsDTO {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    text: string;
}