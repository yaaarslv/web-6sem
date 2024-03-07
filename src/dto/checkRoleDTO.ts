import {IsNotEmpty, IsString} from "class-validator";

export class CheckRoleDTO {
    @IsNotEmpty()
    @IsString()
    token: string;
}