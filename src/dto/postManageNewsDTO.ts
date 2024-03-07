import {IsNotEmpty, IsString} from "class-validator";

export class PostManageNewsDTO {
    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    text: string;
}