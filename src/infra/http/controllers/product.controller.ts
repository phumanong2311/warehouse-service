import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FindProductUseCase, ManageProductUseCase } from '../../../application/product/use-cases/';
import { DomainProductEntity } from '../../../domain/product/entities';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly findProductUseCase: FindProductUseCase,
    private readonly manageProductUseCase: ManageProductUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    if (query.limit || query.page || query.filter) {
      return await this.findProductUseCase.findWithPagination(query);
    }
    return await this.findProductUseCase.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findProductUseCase.findById(id);
  }

  @Post()
  async create(@Body() productData: CreateProductDto) {
    const product = new DomainProductEntity(productData);
    return await this.manageProductUseCase.create(product);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    return await this.manageProductUseCase.update(id, productData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.manageProductUseCase.delete(id);
  }
}
