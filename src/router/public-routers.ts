import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ProductControllerModule } from 'src/domain/product/controller/product-controller.module';

@Module({
  imports: [
    ProductControllerModule,
    RouterModule.register([
      {
        path: '/product',
        module: ProductControllerModule,
      },
    ]),
  ],
})
export class PublicRouter {}
