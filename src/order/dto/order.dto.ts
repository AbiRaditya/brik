import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}
