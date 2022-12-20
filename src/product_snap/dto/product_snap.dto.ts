import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class ProductSnapDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image_url: string;

  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
