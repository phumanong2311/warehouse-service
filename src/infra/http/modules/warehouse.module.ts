import { Module } from '@nestjs/common';
import {
  FindWarehouseUseCaseImpl,
  InventoryManagementUseCaseImpl,
  ManageWarehouseUseCaseImpl,
} from '../../../application/warehouse/use-cases';
import {
  InventoryRepository,
  WarehouseRepository,
} from '../../postgresql/repositories';
import { InventoryController, WarehouseController } from '../controllers/warehouse.controller';

@Module({
  imports: [],
  controllers: [WarehouseController, InventoryController],
  providers: [
    // Repository Implementations
    {
      provide: 'IWarehouseRepository',
      useClass: WarehouseRepository,
    },
    {
      provide: 'IInventoryRepository',
      useClass: InventoryRepository,
    },
    // TODO: Add product repository when available
    {
      provide: 'IProductRepository',
      useValue: null, // Temporary placeholder
    },

    // Use Case Implementations
    {
      provide: 'FindWarehouseUseCase',
      useFactory: (warehouseRepository) => {
        return new FindWarehouseUseCaseImpl(warehouseRepository);
      },
      inject: ['IWarehouseRepository'],
    },
    {
      provide: 'ManageWarehouseUseCase',
      useFactory: (warehouseRepository) => {
        return new ManageWarehouseUseCaseImpl(warehouseRepository);
      },
      inject: ['IWarehouseRepository'],
    },
    {
      provide: 'InventoryManagementUseCase',
      useFactory: (inventoryRepository, warehouseRepository, productRepository) => {
        return new InventoryManagementUseCaseImpl(
          inventoryRepository,
          warehouseRepository,
          productRepository,
        );
      },
      inject: ['IInventoryRepository', 'IWarehouseRepository', 'IProductRepository'],
    },

    // Use Case Aliases for Controller Injection
    {
      provide: FindWarehouseUseCaseImpl,
      useExisting: 'FindWarehouseUseCase',
    },
    {
      provide: ManageWarehouseUseCaseImpl,
      useExisting: 'ManageWarehouseUseCase',
    },
    {
      provide: InventoryManagementUseCaseImpl,
      useExisting: 'InventoryManagementUseCase',
    },
  ],
  exports: [
    'IWarehouseRepository',
    'IInventoryRepository',
    'FindWarehouseUseCase',
    'ManageWarehouseUseCase',
    'InventoryManagementUseCase',
  ],
})
export class WarehouseModule {}
