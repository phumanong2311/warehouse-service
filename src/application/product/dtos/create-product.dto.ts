import { IsString, IsOptional, IsNotEmpty, Length, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  variantValueId!: string;

  @IsOptional()
  @IsString()
  rackId?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[a-zA-Z0-9\s\-_.,()&]+$/, {
    message: 'Product name contains invalid characters'
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[A-Za-z0-9\-]+$/, {
    message: 'SKU can only contain letters, numbers, and hyphens'
  })
  sku!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @IsOptional()
  @IsString()
  rackId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
