import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { StatisticEntity } from './entities/statistic.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getStatisticsByWeek(
    date: Date,
    currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await this.getStatisticsByDateRange(
      startOfWeek,
      endOfWeek,
      currentStore,
    );
  }

  async getStatisticsByMonth(
    date: Date,
    currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return await this.getStatisticsByDateRange(
      startOfMonth,
      endOfMonth,
      currentStore,
    );
  }

  async getStatisticsByYear(
    date: Date,
    currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return await this.getStatisticsByDateRange(
      startOfYear,
      endOfYear,
      currentStore,
    );
  }

  async getStatisticsAllStoreByYear(date: Date, currentUser: UserEntity) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return await this.getStatisticsByUser(startOfYear, endOfYear, currentUser);
  }

  async getStatisticsAllStoreByWeek(
    date: Date,
    currentUser: UserEntity,
  ): Promise<StatisticResponseDto[]> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return await this.getStatisticsByUser(startOfWeek, endOfWeek, currentUser);
  }

  async getStatisticsAllStoreByMonth(
    date: Date,
    currentUser: UserEntity,
  ): Promise<StatisticResponseDto[]> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return await this.getStatisticsByUser(
      startOfMonth,
      endOfMonth,
      currentUser,
    );
  }

  private async getStatisticsByUser(
    startDate: Date,
    endDate: Date,
    currentUser: UserEntity,
  ): Promise<StatisticResponseDto[]> {
    const stores = await this.usersService.getAllStore(currentUser);
    for (const store of stores) {
      const statistics = await this.statisticRepository.find({
        where: {
          startDate: startDate,
          endDate: endDate,
          store: store,
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

  private async getStatisticsByDateRange(
    startDate: Date,
    endDate: Date,
    currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    const statistics = await this.statisticRepository.find({
      where: {
        startDate: startDate,
        endDate: endDate,
        store: currentStore,
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
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const previousDayStatistics = await this.getStatisticsForPreviousDay(today);

    for (const statistic of previousDayStatistics) {
      const createStatisticDto: CreateStatisticDto = {
        totalProducts: statistic.totalProducts,
        totalRevenue: statistic.totalRevenue,
        totalDiscount: statistic.totalDiscount,
        totalOrders: statistic.totalOrders,
        startDate: yesterday,
        endDate: today,
      };

      await this.createStatistic(createStatisticDto, statistic.store);
    }
  }

  private async getStatisticsForPreviousDay(date: Date): Promise<
    {
      store: StoreEntity;
      totalProducts: number;
      totalRevenue: number;
      totalDiscount: number;
      totalOrders: number;
    }[]
  > {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const startOfDay = new Date(previousDay);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(previousDay);
    endOfDay.setHours(23, 59, 59, 999);

    const stores = await this.statisticRepository
      .createQueryBuilder('statistic')
      .select('statistic.storeId', 'storeId')
      .distinct(true)
      .getRawMany();

    const results = await Promise.all(
      stores.map(async (store) => {
        const totalOrders = await this.statisticRepository.count({
          where: {
            store: store,
            startDate: startOfDay,
            endDate: endOfDay,
          },
        });

        const statistics = await this.statisticRepository
          .createQueryBuilder('statistic')
          .select('SUM(statistic.totalProducts)', 'totalProducts')
          .addSelect('SUM(statistic.totalRevenue)', 'totalRevenue')
          .addSelect('SUM(statistic.totalDiscount)', 'totalDiscount')
          .where(
            'statistic.store = :store AND statistic.startDate >= :start AND statistic.endDate <= :end',
            {
              store: store.store,
              start: startOfDay,
              end: endOfDay,
            },
          )
          .getRawOne();

        if (!statistics) {
          return {
            store: store.store,
            totalProducts: 0,
            totalRevenue: 0,
            totalDiscount: 0,
            totalOrders: totalOrders,
          };
        }

        return {
          store: store.store,
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
      }),
    );

    return results;
  }

  private async createStatistic(
    createStatisticDto: CreateStatisticDto,
    currentStore: StoreEntity,
  ): Promise<StatisticResponseDto> {
    let statistic = this.statisticRepository.create(createStatisticDto);
    statistic.store = currentStore;
    statistic = await this.statisticRepository.save(statistic);

    return {
      id: statistic.id,
      totalProducts: statistic.totalProducts,
      totalRevenue: statistic.totalRevenue,
      totalDiscount: statistic.totalDiscount,
      totalOrders: statistic.totalOrders,
      startDate: statistic.startDate,
      endDate: statistic.endDate,
      store: statistic.store,
    };
  }
}
