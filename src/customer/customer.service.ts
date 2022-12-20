import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    customerDto: CustomerDto,
  ): Promise<{ id: Number; name: string }> {
    const customer = new Customer();
    customer.name = customerDto.name;
    const { id, name } = await this.customerRepository.save(customer);
    return { id, name };
  }

  async findOneByName(
    name: string,
  ): Promise<CustomerDto & { id: number | string }> {
    // Logger.log(username, 'username 46');
    // if (!username) {
    //   throw new Error('Username Not Found');
    // }

    const customer = await this.customerRepository.findOneOrFail({
      where: {
        name: name,
      },
    });

    return customer;
  }

  async deleteByName(name: string): Promise<any> {
    const response = this.customerRepository
      .createQueryBuilder(`customer`)
      .delete()
      .where(`customer.name == :name`, {
        name: name,
      })
      .execute();
    return response;
  }

  async findAll(): Promise<Customer[]> {
    const response = this.customerRepository
      .createQueryBuilder(`customer`)
      .select([`customer.id`, `customer.name`])
      .getMany();
    return response;
  }
}
