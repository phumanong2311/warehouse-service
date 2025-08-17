import { WarehouseRepository } from '@infra/postgresql/repositories';
import { Module } from '@nestjs/common';
import { WarehouseApplicationModule } from '@application/warehouse/warehouse-application.module';
import { WarehouseController } from './warehouse.controller';

@Module({
  imports: [WarehouseApplicationModule],
  controllers: [WarehouseController],
  providers: [
    {
      provide: 'IWarehouseRepository',
      useClass: WarehouseRepository,
    },
  ],
})
export class WarehouseControllerModule {}
