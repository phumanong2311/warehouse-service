import { Injectable, Inject } from '@nestjs/common';
import { DomainProductEntity, ProductVariant } from '@domain/product/entities/product.entity';
import { IProductRepository } from '@domain/product/interface-repositories/product.interface.repository';
import { ProductDomainService } from '@domain/product/services/product-domain.service';
import { ProductSpecificationFactory } from '@domain/product/specifications/product.specifications';
import { ProductNotFoundException, ProductAlreadyExistsException } from '@domain/product/exceptions';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductQueryDto, 
  ProductResponseDto, 
  PaginatedProductResponseDto 
} from '../dtos';

@Injectable()
export class ProductApplicationService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    private readonly productDomainService: ProductDomainService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Validate SKU uniqueness
    await this.productDomainService.validateProductCreation(
      new (await import('@domain/product/value-objects')).SKU(dto.sku),
      (sku: string) => this.productRepository.existsBySku(sku).then(exists => !exists)
    );

    // Convert DTO variants to domain variants
    const variants: ProductVariant[] = dto.variants?.map(v => ({
      id: require('uuid').v4(),
      variantValueId: v.variantValueId,
      rackId: v.rackId,
    })) || [];

    // Create domain entity
    const product = new DomainProductEntity({
      name: dto.name,
      sku: dto.sku,
      description: dto.description,
      categoryId: dto.categoryId,
      warehouseId: dto.warehouseId,
      variants,
      rackId: dto.rackId,
    });

    // Save and return
    const savedProduct = await this.productRepository.save(product);
    return this.mapToResponseDto(savedProduct);
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return this.mapToResponseDto(product);
  }

  async getProductBySku(sku: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findBySku(sku);
    if (!product) {
      throw new ProductNotFoundException(`SKU: ${sku}`);
    }
    return this.mapToResponseDto(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }

    // Apply domain validation
    this.productDomainService.validateProductUpdate(product, dto);

    // Apply updates
    if (dto.description !== undefined) {
      product.updateDescription(dto.description);
    }

    if (dto.rackId) {
      product.assignToRack(dto.rackId);
    }

    // Save and return
    const updatedProduct = await this.productRepository.update(id, product);
    return this.mapToResponseDto(updatedProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }

    // Apply domain validation
    this.productDomainService.validateProductDeletion(product);

    await this.productRepository.delete(id);
  }

  async getProducts(query: ProductQueryDto): Promise<PaginatedProductResponseDto> {
    const searchQuery = {
      warehouseId: query.warehouseId,
      categoryId: query.categoryId,
      rackId: query.rackId,
      sku: query.sku,
      name: query.name,
      hasVariants: query.hasVariants,
    };

    const paginationOptions = {
      limit: query.limit,
      page: query.page,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await this.productRepository.findWithPagination(searchQuery, paginationOptions);

    return {
      data: result.data.map(product => this.mapToResponseDto(product)),
      total: result.total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(result.total / query.limit!),
    };
  }

  async getProductsInWarehouse(warehouseId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findInWarehouse(warehouseId);
    return products.map(product => this.mapToResponseDto(product));
  }

  async getProductsInCategory(categoryId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findInCategory(categoryId);
    return products.map(product => this.mapToResponseDto(product));
  }

  async getProductsInRack(rackId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findInRack(rackId);
    return products.map(product => this.mapToResponseDto(product));
  }

  async addVariantToProduct(productId: string, variant: Omit<ProductVariant, 'id'>): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    const variantWithId: ProductVariant = {
      id: require('uuid').v4(),
      ...variant,
    };

    product.addVariant(variantWithId);

    const updatedProduct = await this.productRepository.update(productId, product);
    return this.mapToResponseDto(updatedProduct);
  }

  async removeVariantFromProduct(productId: string, variantId: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    product.removeVariant(variantId);

    const updatedProduct = await this.productRepository.update(productId, product);
    return this.mapToResponseDto(updatedProduct);
  }

  async transferProductToWarehouse(productId: string, targetWarehouseId: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    await this.productDomainService.transferProductToWarehouse(
      product,
      targetWarehouseId,
      async (warehouseId: string) => {
        // This would typically call a warehouse service or repository
        // For now, we'll assume the warehouse exists
        return true;
      }
    );

    const updatedProduct = await this.productRepository.update(productId, product);
    return this.mapToResponseDto(updatedProduct);
  }

  private mapToResponseDto(product: DomainProductEntity): ProductResponseDto {
    return {
      id: product.getId(),
      name: product.getName(),
      sku: product.getSku(),
      description: product.hasDescription() ? product.getDescription() : undefined,
      categoryId: product.getCategory(),
      warehouseId: product.getWarehouse(),
      rackId: product.getRack(),
      variants: product.getVariants().map(v => ({
        id: v.id,
        variantValueId: v.variantValueId,
        rackId: v.rackId,
      })),
      createdAt: product.getCreatedAt(),
      updatedAt: product.getUpdatedAt(),
      createdBy: product.getCreatedBy(),
      updatedBy: product.getUpdatedBy(),
    };
  }
}
