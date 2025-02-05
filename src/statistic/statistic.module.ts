import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { StatisticEntity } from './entities/statistic.entity';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatisticEntity]),
    OrdersModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
