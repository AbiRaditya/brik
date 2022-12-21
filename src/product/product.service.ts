import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { ProductSnap } from 'src/product_snap/product_snap.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productDto: ProductDto): Promise<ProductDto> {
    const product = new Product();
    product.name = productDto.name;
    product.price = productDto.price;
    product.description = productDto.description;
    product.image_url = productDto.image_url;

    return await this.productRepository.save(product);
  }

  async snapCreate(productDto: ProductDto): Promise<ProductDto> {
    const connection = this.productRepository.manager.connection;
    return connection.transaction(async (transactionalEntityManager) => {
      const product = new Product();
      product.name = productDto.name;
      product.price = productDto.price;
      product.stock = productDto.stock;
      product.description = productDto.description;
      product.image_url = productDto.image_url;

      const productResponse = await transactionalEntityManager.save(
        Product,
        product,
      );

      const productSnap = new ProductSnap();
      productSnap.name = productDto.name;
      productSnap.price = productDto.price;
      productSnap.description = productDto.description;
      productSnap.image_url = productDto.image_url;
      productSnap.productId = productResponse.id;

      const snapResponse = await transactionalEntityManager.save(
        ProductSnap,
        productSnap,
      );

      return snapResponse;
    });

    // const response = await this.productRepository.save(product);

    //

    // const response2 = await this.productSnapRepo.save(productSnap);
    // return;
  }

  async edit(editProductDto: ProductDto) {
    const setProduct: {
      name?: string;
      price?: number;
      description?: string;
      image_url?: string;
      stock?: number;
    } = {};

    if (editProductDto.name) {
      setProduct.name = editProductDto.name;
    }
    if (editProductDto.price) {
      setProduct.price = editProductDto.price;
    }
    if (editProductDto.description) {
      setProduct.description = editProductDto.description;
    }
    if (editProductDto.image_url) {
      setProduct.image_url = editProductDto.image_url;
    }
    if (editProductDto.stock) {
      setProduct.stock = editProductDto.stock;
    }

    const response = this.productRepository
      .createQueryBuilder(`product`)
      .update()
      .set(setProduct)
      .where(`product.id = :id`, {
        id: editProductDto.id,
      })
      .execute();
    return response;
  }

  editSnap(editProductDto: ProductDto) {
    const setProduct: {
      name?: string;
      price?: number;
      description?: string;
      image_url?: string;
      stock?: number;
    } = {};

    if (editProductDto.name) {
      setProduct.name = editProductDto.name;
    }
    if (editProductDto.price) {
      setProduct.price = editProductDto.price;
    }
    if (editProductDto.description) {
      setProduct.description = editProductDto.description;
    }
    if (editProductDto.image_url) {
      setProduct.image_url = editProductDto.image_url;
    }
    if (editProductDto.stock) {
      setProduct.stock = editProductDto.stock;
    }

    const connection = this.productRepository.manager.connection;
    return connection.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(
        Product,
        {
          id: editProductDto.id,
        },
        setProduct,
      );

      const productFind = await transactionalEntityManager.findOneOrFail(
        Product,
        {
          where: { id: editProductDto.id },
        },
      );
      //   const snapTest = await transactionalEntityManager.findOne(ProductSnap, {
      //     where: { productId: editProductDto.id },
      //     order: { created_at: `DESC` },
      //   });
      //   console.log('====================================');
      //   console.log(snapTest);
      //   console.log('====================================');
      const productSnap = new ProductSnap();
      productSnap.name = productFind.name;
      productSnap.price = productFind.price;
      productSnap.description = productFind.description;
      productSnap.image_url = productFind.image_url;
      productSnap.productId = productFind.id;

      const snapResponse = await transactionalEntityManager.save(
        ProductSnap,
        productSnap,
      );

      return snapResponse;
    });

    // const queryRunner = this.productRepository.manager.createQueryBuilder().cr
  }

  findAll(queryParam: {
    limit: number;
    page: number;
    search: string;
  }): Promise<[Product[], number]> {
    // const response = this.productRepository.findAndCount();
    // return response;
    const size = queryParam.limit ? queryParam.limit : 10;
    const skip = queryParam.page ? (queryParam.page - 1) * size : 0;
    const search = queryParam.search;

    const response = this.productRepository
      .createQueryBuilder('product')
      .where(`product.isDeleted = :isDeleted`, { isDeleted: false })
      .andWhere(`product.stock > 0`)
      .select([
        `product.id`,
        `product.name`,
        `product.price`,
        `product.description`,
        `product.image_url`,
        `product.stock`,
      ])
      .orderBy(`product.created_at`, `ASC`)
      .take(size)
      .skip(skip);

    if (search) {
      response.andWhere('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    return response.getManyAndCount();
  }

  delete(id: string) {
    const response = this.productRepository
      .createQueryBuilder(`product`)
      .update()
      .set({ isDeleted: true })
      .where(`product.id = :id`, {
        id: id,
      })
      .execute();
    return response;
  }

  findOne(id: string) {
    const response = this.productRepository.findOneOrFail({
      where: { id: +id },
      select: {
        id: true,
        name: true,
        price: true,
        image_url: true,
        description: true,
      },
    });
    return response;
  }
}
