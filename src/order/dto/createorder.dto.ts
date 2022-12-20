import { ProductDto } from 'src/product/dto/product.dto';
import { CustomerDto } from 'src/customer/dto/customer.dto';
import {
  IsString,
  MinLength,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsArray()
  products: number[];

  customerData: CustomerDto;
}
