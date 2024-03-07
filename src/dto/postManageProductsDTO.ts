import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class PostManageProductsDTO {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    action: string;

    @IsOptional()
    @IsString()
    newName?: string;

    @IsOptional()
    @IsString()
    newPrice?: string;

    @IsOptional()
    @IsString()
    newCategory?: string;

    @IsOptional()
    @IsString()
    newBrand?: string;

    @IsOptional()
    @IsString()
    newCount?: string;
}