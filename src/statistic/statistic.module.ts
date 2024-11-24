import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from './entities/statistic.entity';

@Module({
  imports: [OrdersModule, TypeOrmModule.forFeature([StatisticEntity])],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
