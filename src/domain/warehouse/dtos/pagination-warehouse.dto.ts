import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// FilterType class
export class FilterType {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  create_by?: string;

  @IsOptional()
  @IsString()
  update_by?: string;

  @IsOptional()
  create_at?: Date;

  @IsOptional()
  update_at?: Date;
}

// SortType class
export class SortType {
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @IsString()
  field: keyof FilterType;
}

export class PaginationWarehouseDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  created_by?: string;

  @IsOptional()
  @IsString()
  updated_by?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  @ValidateNested() // Áp dụng validate cho các đối tượng lồng
  @Type(() => SortType)
  sort?: SortType;
}
