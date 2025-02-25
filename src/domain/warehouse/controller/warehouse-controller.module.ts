import { WarehouseRepository } from '@infra/postgresql/repositories';
import { Module } from '@nestjs/common';
import { WarehouseService } from '../services';
import { WarehouseController } from './warehouse.controller';

@Module({
  imports: [],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    {
      provide: 'IWarehouseRepository',
      useClass: WarehouseRepository,
    },
  ],
  exports: ['IWarehouseRepository'],
})
export class WarehouseControllerModule {}
