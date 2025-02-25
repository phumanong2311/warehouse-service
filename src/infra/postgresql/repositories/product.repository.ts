import { DomainProductEntity } from '@domain/product/entities';
import { ProductMapper } from '@domain/product/mapper';
import { FilterQuery } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Product } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class ProductRepository extends BaseRepository<Product> {
  constructor(em: SqlEntityManager) {
    super(em, Product);
  }
  async findByProductId(id: string): Promise<DomainProductEntity> {
    const data = await this.findById(id);
    return ProductMapper.entityInfraToDomain(data);
  }

  async findProductsInWarehouse(
    warehouseId: string,
  ): Promise<DomainProductEntity[]> {
    const data = await this.find({ warehouse: warehouseId });
    return data.map((item) => ProductMapper.entityInfraToDomain(item));
  }

  async findProductsInCategory(
    categoryId: string,
  ): Promise<DomainProductEntity[]> {
    const data = await this.find({ category: categoryId });
    return data.map((item) => ProductMapper.entityInfraToDomain(item));
  }

  async findWithPagination(query: {
    warehouseId?: string;
    categoryId?: string;
    rackId?: string;
    sku?: string;
    name?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: DomainProductEntity[]; total: number }> {
    const { limit, page, ...filters } = query;

    const where: FilterQuery<Product> = {};
    if (filters.warehouseId) {
      where.warehouse = filters.warehouseId;
    }
    if (filters.categoryId) {
      where.category = filters.categoryId;
    }
    if (filters.rackId) {
      where.rack = filters.rackId;
    }
    if (filters.sku) {
      where.sku = { $like: `%${filters.sku}%` };
    }
    if (filters.name) {
      where.name = { $like: `%${filters.name}%` };
    }

    const { data, total } = await this.findPagination({
      filter: where,
      limit,
      page,
    });

    const mappedData = data.map(ProductMapper.entityInfraToDomain);

    return {
      data: mappedData,
      total,
    };
  }

  async findAllProducts(): Promise<DomainProductEntity[]> {
    const data = await this.findAll();
    return data.map(ProductMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    product: DomainProductEntity,
  ): Promise<DomainProductEntity> {
    const entity = ProductMapper.entityDomainToInfra(product);
    const savedEntity = await this.save(entity);
    return ProductMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity> {
    if (!id) {
      throw new Error('ID is required to update the warehouse.');
    }
    const existingEntity = await this.findById(id);
    if (!existingEntity) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    const updatedDate = { ...existingEntity, ...product };
    const entityToUpdate = ProductMapper.entityDomainToInfra(updatedDate);
    const updatedEntity = await this.update(id, entityToUpdate);
    return ProductMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteProduct(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
