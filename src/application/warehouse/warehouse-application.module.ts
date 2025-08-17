import { Module } from '@nestjs/common';
import { WarehouseApplicationService } from './services/warehouse-application.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'IWarehouseRepository',
      useClass: null, // Will be provided by Infrastructure layer
    },
    {
      provide: 'IWarehouseService',
      useClass: WarehouseApplicationService,
    },
  ],
  exports: ['IWarehouseService'],
})
export class WarehouseApplicationModule {} 
