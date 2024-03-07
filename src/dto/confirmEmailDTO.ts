import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class ConfirmEmailDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}