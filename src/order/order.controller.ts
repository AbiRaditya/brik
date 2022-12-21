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

import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { CreateOrderDto } from './dto/createorder.dto';

import { IResponseError } from 'src/error-handler/response.error.interface';
import { GlobalExceptionFilter } from 'src/error-handler/exception.filter';
import { MessageResponse } from 'src/response-dto/response.dto';
const globalExceptionFIlter = new GlobalExceptionFilter();

@Controller(`order`)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderDto: CreateOrderDto) {
    try {
      const response = await this.orderService.createOrder(orderDto);
      return {
        message: [`successfully create order`],
        data: response,
        status: 201,
      };
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }

  @Get()
  async getAllOrders() {
    try {
      const response = await this.orderService.findAll();
      return response;
    } catch (error) {
      console.log(error, 'error');
      const errorObj = globalExceptionFIlter.catch(error);
      throw new HttpException(errorObj, errorObj.statusCode);
    }
  }
}
