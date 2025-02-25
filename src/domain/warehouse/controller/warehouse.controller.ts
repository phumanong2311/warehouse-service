import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationWarehouseDto } from '../dtos';
import { WarehouseService } from '../services/warehouse.service';

@Controller()
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('')
  async findWarehousesWithPagination(@Query() query: PaginationWarehouseDto) {
    return await this.warehouseService.findWithPagination(query);
  }

  @Get('/all')
  async findAllWarehouses() {
    return await this.warehouseService.findAll();
  }

  @Get(':id')
  async findWarehouseById(@Param('id') id: string) {
    const warehouse = await this.warehouseService.findByIdWarehouse(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found.`);
    }
    return warehouse;
  }
}
