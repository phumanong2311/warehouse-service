import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  FindWarehouseUseCase,
  InventoryManagementUseCase,
  ManageWarehouseUseCase,
} from '../../../application/warehouse/use-cases';
import {
  AdjustInventoryDto,
  CheckInInventoryDto,
  CheckOutInventoryDto,
  CreateInventoryDto,
  CreateWarehouseDto,
  PaginationInventoryDto,
  PaginationWarehouseDto,
  PhysicalCountAdjustmentDto,
  TransferInventoryDto,
  UpdateInventoryDto,
  UpdateWarehouseDto,
  WriteOffInventoryDto,
} from '../dtos/warehouse.dto';
import { InventoryDtoMapper } from '../mappers/inventory-dto.mapper';
import { WarehouseDtoMapper } from '../mappers/warehouse-dto.mapper';

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly findWarehouseUseCase: FindWarehouseUseCase,
    private readonly manageWarehouseUseCase: ManageWarehouseUseCase,
    private readonly inventoryManagementUseCase: InventoryManagementUseCase,
  ) {}

  // Warehouse Management Endpoints
  @Get()
  async findWarehousesWithPagination(@Query() query: PaginationWarehouseDto) {
    try {
      const paginationQuery = WarehouseDtoMapper.paginationDtoToQuery(query);
      return await this.findWarehouseUseCase.findWithPagination(paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  async findAllWarehouses() {
    try {
      return await this.findWarehouseUseCase.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findWarehouseById(@Param('id') id: string) {
    try {
      const warehouse = await this.findWarehouseUseCase.findById(id);
      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID ${id} not found.`);
      }
      return warehouse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  async createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    try {
      const warehouseEntity = WarehouseDtoMapper.createDtoToDomainEntity(createWarehouseDto);
      return await this.manageWarehouseUseCase.create(warehouseEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    try {
      const partialWarehouseEntity = WarehouseDtoMapper.updateDtoToPartialDomainEntity(updateWarehouseDto);
      return await this.manageWarehouseUseCase.update(id, partialWarehouseEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteWarehouse(@Param('id') id: string) {
    try {
      await this.manageWarehouseUseCase.delete(id);
      return { message: `Warehouse with ID ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Warehouse-specific inventory endpoints
  @Get(':id/inventory')
  async getWarehouseInventory(@Param('id') id: string) {
    try {
      return await this.inventoryManagementUseCase.findByWarehouse(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryManagementUseCase: InventoryManagementUseCase,
  ) {}

  // Basic CRUD operations
  @Get()
  async findInventoryWithPagination(@Query() query: PaginationInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.findWithPagination(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  async findAllInventory() {
    try {
      return await this.inventoryManagementUseCase.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findInventoryById(@Param('id') id: string) {
    try {
      const inventory = await this.inventoryManagementUseCase.findById(id);
      if (!inventory) {
        throw new NotFoundException(`Inventory with ID ${id} not found.`);
      }
      return inventory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  async createInventory(@Body() createInventoryDto: CreateInventoryDto) {
    try {
      const inventoryEntity = InventoryDtoMapper.createDtoToDomainEntity(createInventoryDto);
      return await this.inventoryManagementUseCase.create(inventoryEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    try {
      const partialInventoryEntity = InventoryDtoMapper.updateDtoToPartialDomainEntity(updateInventoryDto);
      return await this.inventoryManagementUseCase.update(id, partialInventoryEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: string) {
    try {
      await this.inventoryManagementUseCase.delete(id);
      return { message: `Inventory with ID ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Inventory Operations
  @Post('check-in')
  async checkIn(@Body() checkInDto: CheckInInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.checkIn(
        checkInDto.warehouseId,
        checkInDto.productId,
        checkInDto.unitId,
        checkInDto.quantity,
        checkInDto.status,
        checkInDto.expirationDate ? new Date(checkInDto.expirationDate) : undefined,
        checkInDto.batch,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('check-out')
  async checkOut(@Body() checkOutDto: CheckOutInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.checkOut(
        checkOutDto.warehouseId,
        checkOutDto.productId,
        checkOutDto.unitId,
        checkOutDto.quantity,
        checkOutDto.status,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('transfer')
  async transfer(@Body() transferDto: TransferInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.transfer(
        transferDto.fromWarehouseId,
        transferDto.toWarehouseId,
        transferDto.productId,
        transferDto.unitId,
        transferDto.quantity,
        transferDto.status,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Business Adjustment Operations
  @Post('adjust')
  async adjustInventory(@Body() adjustDto: AdjustInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.adjustInventory(
        adjustDto.warehouseId,
        adjustDto.productId,
        adjustDto.unitId,
        adjustDto.adjustmentQuantity,
        adjustDto.reason,
        adjustDto.notes,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('write-off')
  async writeOff(@Body() writeOffDto: WriteOffInventoryDto) {
    try {
      return await this.inventoryManagementUseCase.writeOff(
        writeOffDto.warehouseId,
        writeOffDto.productId,
        writeOffDto.unitId,
        writeOffDto.quantity,
        writeOffDto.reason,
        writeOffDto.notes,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('physical-count')
  async physicalCountAdjustment(@Body() physicalCountDto: PhysicalCountAdjustmentDto) {
    try {
      return await this.inventoryManagementUseCase.physicalCountAdjustment(
        physicalCountDto.warehouseId,
        physicalCountDto.productId,
        physicalCountDto.unitId,
        physicalCountDto.physicalCount,
        physicalCountDto.reason,
        physicalCountDto.notes,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Query by product
  @Get('product/:productId')
  async findInventoryByProduct(@Param('productId') productId: string) {
    try {
      return await this.inventoryManagementUseCase.findByProduct(productId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
