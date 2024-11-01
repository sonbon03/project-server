import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticEntity } from './entities/statistic.entity';
import { StatisticResponseDto } from './dto/statistic-response.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
  ) {}

  async getStatisticsByDay(date: Date): Promise<StatisticResponseDto[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getStatisticsByDateRange(startOfDay, endOfDay);
  }

  async getStatisticsByWeek(date: Date): Promise<StatisticResponseDto[]> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await this.getStatisticsByDateRange(startOfWeek, endOfWeek);
  }

  async getStatisticsByMonth(date: Date): Promise<StatisticResponseDto[]> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return await this.getStatisticsByDateRange(startOfMonth, endOfMonth);
  }

  private async getStatisticsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<StatisticResponseDto[]> {
    const statistics = await this.statisticRepository.find({
      where: {
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (!statistics.length) {
      return [];
    }

    return statistics.map((statistic) => ({
      id: statistic.id,
      totalProducts: statistic.totalProducts,
      totalRevenue: statistic.totalRevenue,
      totalDiscount: statistic.totalDiscount,
      totalOrders: statistic.totalOrders,
      startDate: statistic.startDate,
      endDate: statistic.endDate,
      store: statistic.store,
    }));
  }
}
