import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class PostManageUsersDTO {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    action: string;

    @IsOptional()
    @IsString()
    newRole?: string;

    @IsOptional()
    @IsString()
    isBanned?: string;

    @IsOptional()
    @IsString()
    emailConfirmed?: string;
}