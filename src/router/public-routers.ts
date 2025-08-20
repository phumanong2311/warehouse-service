import { WarehouseControllerModule } from '@domain/warehouse/controller';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ProductModule } from '../infra/http/modules/product.module';

@Module({
  imports: [
    ProductModule,
    WarehouseControllerModule,
    RouterModule.register([
      {
        path: '/product',
        module: ProductModule,
      },
      {
        path: '/warehouse',
        module: WarehouseControllerModule,
      },
    ]),
  ],
})
export class PublicRouter {}
// 1. Cách tổ chức này gọi là
// "Modular Routing" (Định tuyến theo module):

// Tổ chức route theo module, thay vì nhồi nhét tất cả vào app.module.ts.
// Hữu ích khi xây dựng API Gateway hoặc Microservices.
// 2. Lợi ích
// Tách biệt trách nhiệm của từng module
// Quản lý route tập trung ở PublicRouterModule
// Dễ bảo trì & mở rộng khi thêm module mới

// Sau khi áp dụng cách này, API của bạn sẽ dễ tổ chức và maintain hơn rất nhiều! 🚀🔥
