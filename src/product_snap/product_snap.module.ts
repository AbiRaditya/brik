import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSnap } from './product_snap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSnap])],
})
export class ProductSnapModule {}
