export class ProductVariantResponseDto {
  id!: string;
  variantValueId!: string;
  rackId?: string;
}

export class ProductResponseDto {
  id!: string;
  name!: string;
  sku!: string;
  description?: string;
  categoryId!: string;
  warehouseId!: string;
  rackId?: string;
  variants!: ProductVariantResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
  createdBy?: string;
  updatedBy?: string;
}

export class PaginatedProductResponseDto {
  data!: ProductResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
