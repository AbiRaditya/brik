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

import { ProductSnap } from 'src/product_snap/product_snap.entity';

@Entity(`product`)
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Product Pk',
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

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

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

  @OneToMany(() => ProductSnap, (productSnap) => productSnap.product)
  product_snap: ProductSnap[];
}
