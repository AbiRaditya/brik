import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
}
