import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { WarehouseControllerModule } from '@presentation/warehouse/controllers/warehouse-controller.module';
import { ProductControllerModule } from 'src/domain/product/controller/product-controller.module';

@Module({
  imports: [
    ProductControllerModule,
    WarehouseControllerModule,
    RouterModule.register([
      {
        path: '/product',
        module: ProductControllerModule,
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
