import {IsOptional, IsString} from "class-validator";

export class PostManageProductsDTO {
    @IsOptional()
    @IsString()
    cart_id?: string;

    @IsOptional()
    @IsString()
    productId?: number;

    @IsOptional()
    @IsString()
    action?: string;

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