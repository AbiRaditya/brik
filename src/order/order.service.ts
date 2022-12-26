import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { Customer } from 'src/customer/customer.entity';
import { CreateOrderDto } from './dto/createorder.dto';
import { ProductSnap } from 'src/product_snap/product_snap.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderDto: CreateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    return connection.transaction(async (transactionalEntityManager) => {
      const customerData = new Customer();
      const queryBuilder = transactionalEntityManager.createQueryBuilder();

      customerData.name = orderDto.customerData.name;
      if (!customerData.name) {
        throw {
          message: {
            message: `Failed to create customer, customer name must be string and not null`,
          },
        };
      }
      const cusomterResponse = await queryBuilder
        .insert()
        .into(Customer)
        .values(customerData)
        .orUpdate([`name`], [`name`], {
          skipUpdateIfNoValuesChanged: true,
        })
        .returning(`*`)
        .execute();
      let customerId: number;
      let foundCustomer: Customer;

      if (cusomterResponse.raw.length > 0) {
        foundCustomer = cusomterResponse.raw[0];
        customerId = cusomterResponse.raw[0].id;
      } else {
        const dataResponse = await queryBuilder
          .from(Customer, 'customer')
          .select([`customer.id`, `customer.name`])
          .where(`customer.name = :name`, {
            name: orderDto.customerData.name,
          })
          .getOne();

        customerId = dataResponse.id;
        foundCustomer = dataResponse;
      }

      for (const product of orderDto.products) {
        const currentStock = await transactionalEntityManager
          .createQueryBuilder()
          .select('stock')
          .from(Product, 'product')
          .where({ id: product.id })
          .getRawOne();

        if (currentStock.stock - product.stock < 0) {
          throw {
            message: {
              message: `Cannot reduce stock of product id:${product.id} below 0`,
            },
          };
        }
        await queryBuilder
          .update(Product)
          .set({ stock: () => `stock - ${product.stock}` })
          .where({ id: product.id })
          .execute();
      }

      const snapResults = [];
      for (let i = 0; i < orderDto.products.length; i++) {
        const id = orderDto.products[i].id;
        const result = await transactionalEntityManager.findOneOrFail(
          ProductSnap,
          {
            where: { productId: id },
            order: { created_at: `DESC` },
          },
        );
        snapResults.push(result);
      }

      const orderData = new Order();
      orderData.customerId = customerId;
      orderData.products = snapResults;
      orderData.total_price = snapResults.reduce((acc, item) => {
        for (const product of orderDto.products) {
          if (product.id == item.productId) {
            return acc + item.price * product.stock;
          }
        }
      }, 0);
      const orderResult = await transactionalEntityManager.save(
        Order,
        orderData,
      );

      return foundCustomer;
    });
  }

  async create(
    orderDto: OrderDto,
  ): Promise<{ total_price: number; id: number }> {
    const order = new Order();
    order.total_price = orderDto.total_price;
    const { id, total_price } = await this.orderRepository.save(order);

    return { id, total_price };
  }

  async findAll(): Promise<Order[]> {
    const response = await this.orderRepository.find({
      relations: {
        products: true,
        customer: true,
      },
    });
    return response;
  }

  async findOneById(id: number): Promise<{ total_price: number; id: number }> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: id },
    });

    return order;
  }
}
