import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { FindProductUseCase, FindProductUseCaseImpl } from '../../../application/product/use-cases/find-product.use-case';
import { ManageProductUseCase, ManageProductUseCaseImpl } from '../../../application/product/use-cases/manage-product.use-case';
import { ProductRepository } from '../../postgresql/repositories/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    {
      provide: FindProductUseCase,
      useClass: FindProductUseCaseImpl,
    },
    {
      provide: ManageProductUseCase,
      useClass: ManageProductUseCaseImpl,
    },
    ProductRepository,
  ],
})
export class ProductModule {}
