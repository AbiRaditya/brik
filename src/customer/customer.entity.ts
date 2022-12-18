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
  OneToMany,
  // OneToMany,
} from 'typeorm';
import { Order } from 'src/order/order.entity';

@Entity(`customer`)
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Customer PK',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

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

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
