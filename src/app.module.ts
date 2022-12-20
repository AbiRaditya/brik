import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductSnapModule } from './product_snap/product_snap.module';
import { Product } from './product/product.entity';
import { Customer } from './customer/customer.entity';
import { ProductSnap } from './product_snap/product_snap.entity';
import { Order } from './order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [Product, Customer, ProductSnap, Order],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    CustomerModule,
    OrderModule,
    ProductModule,
    ProductSnapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
