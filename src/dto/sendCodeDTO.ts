import {IsEmail, IsNotEmpty} from "class-validator";

export class SendCodeDTO {
    @IsEmail()
    @IsNotEmpty()
    recipient: string;
}