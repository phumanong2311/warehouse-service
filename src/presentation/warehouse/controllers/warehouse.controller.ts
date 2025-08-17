import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';
import { PaginationWarehouseDto } from '@application/warehouse/dtos/pagination-warehouse.dto';
import { IWarehouseService } from '@application/warehouse/interfaces/warehouse.service';

@Controller()
export class WarehouseController {
  constructor(
    @Inject('IWarehouseService')
    private readonly warehouseService: IWarehouseService,
  ) {}

  @Get('')
  async findWarehousesWithPagination(@Query() query: PaginationWarehouseDto) {
    console.log('query', query);
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
