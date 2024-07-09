import { IsInt, IsOptional, IsPositive, Min } from '@nestjs/class-validator';

export class AllProductsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  pageSize?: number = 10;
}
