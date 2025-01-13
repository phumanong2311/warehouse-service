import { DomainProductEntity } from '@domain/product/entities';
import { ProductMapper } from '@domain/product/mapper';
import { Product } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class ProductRepository extends BaseRepository<Product> {
  async findByIdWithMapper(id: string): Promise<DomainProductEntity> {
    const data = await this.findById(id);
    return ProductMapper.entityInfraToDomain(data);
  }

  async findProductsInWarehouse(
    warehouseId: string,
  ): Promise<DomainProductEntity[]> {
    const data = await this.find({ warehouse: warehouseId });
    return data.map((item) => ProductMapper.entityInfraToDomain(item));
  }

  async findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(ProductMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllWithMapper(): Promise<DomainProductEntity[]> {
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
    product: DomainProductEntity,
  ): Promise<DomainProductEntity> {
    const entity = ProductMapper.entityDomainToInfra(product);
    const updatedEntity = await this.update(id, entity);
    return ProductMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteWarehouse(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
