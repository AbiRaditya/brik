import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  // OneToMany,
} from 'typeorm';

import { Product } from 'src/product/product.entity';

@Entity(`product_snap`)
export class ProductSnap extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'ProductSnap Pk',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: false,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
    unique: false,
  })
  price: number;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: false,
  })
  image_url: string;

  @ManyToOne(() => Product, (product) => product.product_snap)
  product: Product;
}
