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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';

import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

import { IResponseError } from 'src/error-handler/response.error.interface';
import { GlobalExceptionFilter } from 'src/error-handler/exception.filter';
import { MessageResponse } from 'src/response-dto/response.dto';

import axios from 'axios';
const FormData = require(`form-data`);
const globalExceptionFIlter = new GlobalExceptionFilter();

@Controller(`product`)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor(`image`))
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() productDto: ProductDto,
  ): Promise<MessageResponse | IResponseError> {
    try {
      // const response = await this.productService.snapCreate(productDto);
      if (image) {
        if (image.mimetype !== `image/jpeg` && image.mimetype !== `image/png`) {
          throw { message: { message: `file is not image` } };
        }
        const imageStr = image.buffer.toString(`base64`);
        const formData = new FormData();
        formData.append(`file`, imageStr);
        formData.append(`fileName`, image.originalname);
        const privateKey = Buffer.from(
          this.configService.get<string>('IMAGE_KIT_KEY'),
        ).toString(`base64`);

        // brik_products folder name
        const imageKit = await axios.post(
          `https://upload.imagekit.io/api/v1/files/upload`,
          formData,
          {
            headers: {
              Authorization: `Basic ${privateKey}`,
              ...formData.getHeaders(),
            },
          },
        );
        productDto.image_url = imageKit.data.url;
      }
      const response = await this.productService.snapCreate(productDto);

      return {
        // message: [`successfully created response.name`],
        message: [`successfully created ${response.name}`],
        status: 201,
      };
    } catch (error) {
      console.log(error.response, 'error');
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
  @UseInterceptors(FileInterceptor(`image`))
  async editProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() productDto: ProductDto,
  ): Promise<MessageResponse | IResponseError> {
    try {
      await this.productService.findOne(`${productDto.id}`);

      if (image) {
        if (image.mimetype !== `image/jpeg` && image.mimetype !== `image/png`) {
          throw { message: { message: `file is not image` } };
        }
        const imageStr = image.buffer.toString(`base64`);
        const formData = new FormData();
        formData.append(`file`, imageStr);
        formData.append(`fileName`, image.originalname);
        const privateKey = Buffer.from(
          this.configService.get<string>('IMAGE_KIT_KEY'),
        ).toString(`base64`);

        // brik_products folder name
        const imageKit = await axios.post(
          `https://upload.imagekit.io/api/v1/files/upload`,
          formData,
          {
            headers: {
              Authorization: `Basic ${privateKey}`,
              ...formData.getHeaders(),
            },
          },
        );
        productDto.image_url = imageKit.data.url;
      }
      await this.productService.editSnap(productDto);

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
