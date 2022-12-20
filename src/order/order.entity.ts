import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { Customer } from 'src/customer/customer.entity';
import { ProductSnap } from 'src/product_snap/product_snap.entity';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Order Pk',
  })
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  total_price: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @ManyToMany(() => ProductSnap)
  @JoinTable()
  products: ProductSnap[];
}
