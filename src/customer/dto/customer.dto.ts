import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}