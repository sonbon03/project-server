import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ProductsModule } from 'src/products/products.module';
import { VouchersModule } from 'src/vouchers/vouchers.module';
import { StoreModule } from 'src/store/store.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderProductEntity, OrderEntity, PaymentEntity]),
    ProductsModule,
    StoreModule,
    VouchersModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
