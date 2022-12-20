import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Headers,
  Delete,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';
import { IResponseError } from 'src/error-handler/response.error.interface';
import { GlobalExceptionFilter } from 'src/error-handler/exception.filter';

import { MessageResponse } from 'src/response-dto/response.dto';
const globalExceptionFIlter = new GlobalExceptionFilter();

@Controller(`customer`)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() customerDto: CustomerDto,
  ): Promise<MessageResponse | IResponseError> {
    try {
      const response = await this.customerService.create(customerDto);
      return {
        message: [`Customer ${response.name} created successfully`],
        status: 201,
      };
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }
}
