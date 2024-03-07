import {IsEmail, IsNotEmpty} from "class-validator";

export class SubscriptDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}