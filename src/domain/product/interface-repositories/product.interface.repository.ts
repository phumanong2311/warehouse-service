import { DomainProductEntity } from '../entities';
import { ProductSpecification } from '../specifications/product.specifications';

export interface PaginationOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProductSearchQuery {
  warehouseId?: string;
  categoryId?: string;
  rackId?: string;
  sku?: string;
  name?: string;
  hasVariants?: boolean;
}

export interface IProductRepository {
  // Basic CRUD operations
  findById(id: string): Promise<DomainProductEntity | null>;
  findBySku(sku: string): Promise<DomainProductEntity | null>;
  save(product: DomainProductEntity): Promise<DomainProductEntity>;
  update(id: string, product: DomainProductEntity): Promise<DomainProductEntity>;
  delete(id: string): Promise<void>;

  // Query methods with specifications
  findBySpecification(specification: ProductSpecification): Promise<DomainProductEntity[]>;
  findBySpecificationWithPagination(
    specification: ProductSpecification,
    options: PaginationOptions
  ): Promise<{ data: DomainProductEntity[]; total: number }>;

  // Convenient query methods
  findAll(): Promise<DomainProductEntity[]>;
  findWithPagination(
    query: ProductSearchQuery,
    options: PaginationOptions
  ): Promise<{ data: DomainProductEntity[]; total: number }>;

  // Specific business queries
  findInWarehouse(warehouseId: string): Promise<DomainProductEntity[]>;
  findInCategory(categoryId: string): Promise<DomainProductEntity[]>;
  findInRack(rackId: string): Promise<DomainProductEntity[]>;
  findWithVariants(): Promise<DomainProductEntity[]>;
  findWithoutVariants(): Promise<DomainProductEntity[]>;

  // Validation helpers
  existsBySku(sku: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
  countInWarehouse(warehouseId: string): Promise<number>;
  countInCategory(categoryId: string): Promise<number>;

  // Bulk operations
  saveMany(products: DomainProductEntity[]): Promise<DomainProductEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
}
