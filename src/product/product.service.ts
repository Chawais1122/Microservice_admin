import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddProductDto, AllProductsDto, UpdateProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getAllProducts(dto: AllProductsDto) {
    try {
      const { pageNumber, pageSize } = dto;

      const products = await this.prisma.product.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          image: true,
          likes: true,
          created_at: true,
        },
        orderBy: [{ created_at: 'desc' }],
      });

      return products;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve products.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) throw new NotFoundException(`Product doesn't exist!`);

      return product;
    } catch (error) {
      throw new NotFoundException(`Product doesn't exist!`);
    }
  }

  async addProduct(dto: AddProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...dto,
        },
      });

      this.client.emit('product_added', product);

      return product;
    } catch (error) {
      throw new HttpException(
        'Failed to add the product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProductById(productId: number, dto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...dto,
        },
        select: {
          id: true,
          title: true,
          image: true,
          likes: true,
          created_at: true,
        },
      });

      this.client.emit('product_updated', product);
      return product;
    } catch (error) {
      throw new NotFoundException(`Product doesn't exist!`);
    }
  }

  async deleteProductById(productId: number) {
    try {
      await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });

      await this.client.emit('product_deleted', productId);
      return 'Product deleted';
    } catch (error) {
      throw new NotFoundException(`Product doesn't exist!`);
    }
  }
}
