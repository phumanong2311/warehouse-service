import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  rackId?: string;
}
