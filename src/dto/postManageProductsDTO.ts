import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class PostManageProductsDTO {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

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