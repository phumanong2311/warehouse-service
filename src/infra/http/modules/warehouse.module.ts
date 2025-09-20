import { Module } from '@nestjs/common';
import {
  FindWarehouseUseCaseImpl,
  InventoryManagementUseCaseImpl,
  ManageWarehouseUseCaseImpl,
} from '../../../application/warehouse/use-cases';
import { WarehouseApplicationService } from '../../../application/warehouse/services/warehouse-application.service';
import {
  InventoryService,
  UnitService,
  WarehouseService,
} from '../../../domain/warehouse/services';
import {
  InventoryRepository,
  UnitRepository,
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
    {
      provide: 'IUnitRepository',
      useClass: UnitRepository,
    },

    // Domain Services
    {
      provide: WarehouseService,
      useFactory: (warehouseRepository) => {
        return new WarehouseService(warehouseRepository);
      },
      inject: ['IWarehouseRepository'],
    },
    {
      provide: UnitService,
      useFactory: (unitRepository) => {
        return new UnitService(unitRepository);
      },
      inject: ['IUnitRepository'],
    },
    {
      provide: InventoryService,
      useFactory: (inventoryRepository, warehouseService, unitService) => {
        return new InventoryService(inventoryRepository, warehouseService, unitService);
      },
      inject: ['IInventoryRepository', WarehouseService, UnitService],
    },

    // Application Services
    {
      provide: WarehouseApplicationService,
      useFactory: (warehouseService, inventoryService, unitService) => {
        return new WarehouseApplicationService(warehouseService, inventoryService, unitService);
      },
      inject: [WarehouseService, InventoryService, UnitService],
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
      useFactory: (inventoryRepository, warehouseRepository) => {
        return new InventoryManagementUseCaseImpl(
          inventoryRepository,
          warehouseRepository,
        );
      },
      inject: ['IInventoryRepository', 'IWarehouseRepository'],
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
    'IUnitRepository',
    WarehouseService,
    UnitService,
    InventoryService,
    WarehouseApplicationService,
    'FindWarehouseUseCase',
    'ManageWarehouseUseCase',
    'InventoryManagementUseCase',
  ],
})
export class WarehouseModule {}
