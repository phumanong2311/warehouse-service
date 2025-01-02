import { Controller } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
