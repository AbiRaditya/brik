import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductSnap } from './product_snap.entity';
import { ProductSnapDto } from './dto/product_snap.dto';

@Injectable()
export class ProductSNapService {
  constructor(
    @InjectRepository(ProductSnap)
    private readonly productSnapRepository: Repository<ProductSnap>,
  ) {}

  async create(
    productSnapDto: ProductSnapDto,
  ): Promise<ProductSnapDto & { id: number }> {
    const productSnap = new ProductSnap();
    productSnap.name = productSnapDto.name;
    productSnap.price = productSnapDto.price;
    productSnap.description = productSnapDto.description;
    productSnap.image_url = productSnapDto.image_url;
    productSnap.productId = productSnapDto.productId;
    return await this.productSnapRepository.save(productSnap);
  }
}
