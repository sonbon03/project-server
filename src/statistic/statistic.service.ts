import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { StatisticEntity } from './entities/statistic.entity';

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

  @Cron('0 0 * * *')
  async handleCron() {
    const today = new Date();

    const previousDayStatistics = await this.getStatisticsForPreviousDay(today);

    const createStatisticDto: CreateStatisticDto = {
      totalProducts: previousDayStatistics.totalProducts,
      totalRevenue: previousDayStatistics.totalRevenue,
      totalDiscount: previousDayStatistics.totalDiscount,
      totalOrders: previousDayStatistics.totalOrders,
      startDate: new Date(today.setDate(today.getDate() - 1)),
      endDate: new Date(today),
    };

    await this.createStatistic(createStatisticDto);
  }

  private async getStatisticsForPreviousDay(date: Date): Promise<{
    totalProducts: number;
    totalRevenue: number;
    totalDiscount: number;
    totalOrders: number;
  }> {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const startOfDay = new Date(previousDay);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(previousDay);
    endOfDay.setHours(23, 59, 59, 999);

    const totalOrders = await this.statisticRepository.count({
      where: {
        startDate: startOfDay,
        endDate: endOfDay,
      },
    });

    const statistics = await this.statisticRepository
      .createQueryBuilder('statistic')
      .select('SUM(statistic.totalProducts)', 'totalProducts')
      .addSelect('SUM(statistic.totalRevenue)', 'totalRevenue')
      .addSelect('SUM(statistic.totalDiscount)', 'totalDiscount')
      .where('statistic.startDate >= :start AND statistic.endDate <= :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getRawOne();

    return {
      totalProducts: statistics.totalProducts
        ? Number(statistics.totalProducts)
        : 0,
      totalRevenue: statistics.totalRevenue
        ? Number(statistics.totalRevenue)
        : 0,
      totalDiscount: statistics.totalDiscount
        ? Number(statistics.totalDiscount)
        : 0,
      totalOrders: totalOrders,
    };
  }

  private async createStatistic(
    createStatisticDto: CreateStatisticDto,
  ): Promise<StatisticResponseDto> {
    const statistic = this.statisticRepository.create(createStatisticDto);
    const savedStatistic = await this.statisticRepository.save(statistic);

    return {
      id: savedStatistic.id,
      totalProducts: savedStatistic.totalProducts,
      totalRevenue: savedStatistic.totalRevenue,
      totalDiscount: savedStatistic.totalDiscount,
      totalOrders: savedStatistic.totalOrders,
      startDate: savedStatistic.startDate,
      endDate: savedStatistic.endDate,
      store: savedStatistic.store,
    };
  }
}
