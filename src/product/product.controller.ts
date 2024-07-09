import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto, AllProductsDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  getAllProducts(@Query() dto: AllProductsDto) {
    return this.productService.getAllProducts(dto);
  }

  @Get('/:productId')
  getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }

  @Post()
  createProduct(@Body() dto: AddProductDto) {
    return this.productService.addProduct(dto);
  }

  @Put('/:productId')
  updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(productId, dto);
  }

  @Delete('/:productId')
  deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.deleteProductById(productId);
  }
}
