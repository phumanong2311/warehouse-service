import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ProductApplicationService } from '@application/product/services/product-application.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductQueryDto, 
  ProductResponseDto, 
  PaginatedProductResponseDto 
} from '@application/product/dtos';

@Controller('products')
export class ProductController {
  constructor(private readonly productApplicationService: ProductApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(
    @Query(ValidationPipe) query: ProductQueryDto
  ): Promise<PaginatedProductResponseDto> {
    return this.productApplicationService.getProducts(query);
  }

  @Get('warehouse/:warehouseId')
  async getProductsInWarehouse(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string
  ): Promise<ProductResponseDto[]> {
    return this.productApplicationService.getProductsInWarehouse(warehouseId);
  }

  @Get('category/:categoryId')
  async getProductsInCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string
  ): Promise<ProductResponseDto[]> {
    return this.productApplicationService.getProductsInCategory(categoryId);
  }

  @Get('rack/:rackId')
  async getProductsInRack(
    @Param('rackId', ParseUUIDPipe) rackId: string
  ): Promise<ProductResponseDto[]> {
    return this.productApplicationService.getProductsInRack(rackId);
  }

  @Get('sku/:sku')
  async getProductBySku(
    @Param('sku') sku: string
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.getProductBySku(sku);
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {
    return this.productApplicationService.deleteProduct(id);
  }

  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  async addVariantToProduct(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() variant: { variantValueId: string; rackId?: string }
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.addVariantToProduct(productId, variant);
  }

  @Delete(':id/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVariantFromProduct(
    @Param('id', ParseUUIDPipe) productId: string,
    @Param('variantId', ParseUUIDPipe) variantId: string
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.removeVariantFromProduct(productId, variantId);
  }

  @Put(':id/transfer/:warehouseId')
  async transferProductToWarehouse(
    @Param('id', ParseUUIDPipe) productId: string,
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string
  ): Promise<ProductResponseDto> {
    return this.productApplicationService.transferProductToWarehouse(productId, warehouseId);
  }
}
