import { DomainProductEntity } from '../../../domain/product/entities';
import { IProductRepository } from '../../../domain/product/interface-repositories/product.interface.repository';

export interface ManageProductUseCase {
  create(product: DomainProductEntity): Promise<DomainProductEntity>;
  update(id: string, product: Partial<DomainProductEntity>): Promise<DomainProductEntity>;
  delete(id: string): Promise<void>;
}

export class ManageProductUseCaseImpl implements ManageProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async create(product: DomainProductEntity): Promise<DomainProductEntity> {
    return this.productRepository.saveAndReturnDomain(product);
  }

  async update(
    id: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity> {
    const isExist = await this.productRepository.findByProductId(id);
    if (!isExist) {
      throw new Error(`Product with id ${id} not found`);
    }

    const warehouse = product.getWarehouse?.();
    const rack = product.getRack?.();
    if (warehouse || rack) {
      throw new Error(`Can't update this attribute`);
    }

    return this.productRepository.updateAndReturnDomain(id, product);
  }

  async delete(id: string): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }
}
