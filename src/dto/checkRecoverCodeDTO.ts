import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CheckRecoverCodeDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}