import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from './entities/statistic.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    OrdersModule,
    TypeOrmModule.forFeature([StatisticEntity]),
    UsersModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
