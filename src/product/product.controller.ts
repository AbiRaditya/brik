import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Headers,
  Delete,
  Param,
  Query,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

import { IResponseError } from 'src/error-handler/response.error.interface';
import { GlobalExceptionFilter } from 'src/error-handler/exception.filter';
import { MessageResponse } from 'src/response-dto/response.dto';
import { Product } from './product.entity';
const globalExceptionFIlter = new GlobalExceptionFilter();

@Controller(`product`)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() productDto: ProductDto,
  ): Promise<MessageResponse | IResponseError> {
    try {
      const response = await this.productService.snapCreate(productDto);
      console.log(response, '----------------------');

      return {
        message: [`success ${response.name} created`],
        status: 201,
      };
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }

  @Get()
  async getAllProduct(
    @Query() queryParam: { limit: number; page: number },
  ): Promise<[Product[], number]> {
    try {
      const response = await this.productService.findAll(queryParam);
      return response;
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }

  @Put()
  async editProduct(
    @Body() productDto: ProductDto,
  ): Promise<MessageResponse | IResponseError> {
    try {
      const response = await this.productService.editSnap(productDto);
      //   console.log('====================================');
      //   console.log(response, 'response');
      //   console.log('====================================');
      return {
        message: [`Product successfully updated`],
        status: 200,
      };
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }

  @Delete(`/:id`)
  async deleteProduct(@Param(`id`) id: string) {
    try {
      await this.productService.delete(id);
      return {
        message: [`Product successfully deleted`],
        status: 200,
      };
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }

  @Get(`:id`)
  async getById(@Param(`id`) id: string) {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }
}
