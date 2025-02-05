import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { StatisticEntity } from './entities/statistic.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { StoreEntity } from 'src/store/entities/store.entity';
import { OrdersService } from 'src/orders/orders.service';
import * as _ from 'lodash';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
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

  async getStatisticsAllStoreByYear(
    date: Date,
    currentUser: UserEntity,
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return await this.getStatisticsByUser(startOfYear, endOfYear, currentUser);
  }

  async getStatisticsAllStoreByWeek(
    date: Date,
    currentUser: UserEntity,
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
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
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
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
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
    const stores = await this.usersService.getAllStore(currentUser);
    const listStatisticsStores: {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[] = [];
    for (const store of stores) {
      const statistics = await this.statisticRepository.find({
        where: {
          startDate: startDate,
          endDate: endDate,
        },
      });

      if (!statistics.length) {
        return [];
      }

      statistics.forEach((statistic) => {
        listStatisticsStores.push({
          idStore: store.id,
          name: store.name,
          statistics: {
            id: statistic.id,
            totalProducts: statistic.totalProducts,
            totalRevenue: statistic.totalRevenue,
            totalProfit: statistic.totalProfit,
            totalDiscount: statistic.totalDiscount,
            totalOrders: statistic.totalOrders,
            startDate: statistic.startDate,
            endDate: statistic.endDate,
          },
        });
      });
    }
    return listStatisticsStores;
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
        storeId: currentStore.id,
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
      totalProfit: statistic.totalProfit,
      startDate: statistic.startDate,
      endDate: statistic.endDate,
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
        storeId: statistic.storeId,
        totalProducts: statistic.orders.quantity,
        totalRevenue: statistic.orders.total,
        totalDiscount: statistic.orders.moneyDiscount,
        totalOrders: statistic.orders.totalOrders,
        startDate: yesterday,
        endDate: today,
        totalProfit: statistic.orders.totalProfit,
      };

      await this.createStatistic(createStatisticDto);
    }
  }

  async getStatisticsForPreviousDay(date: Date) {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 23);

    const orders = await this.ordersService.getOrderByDate(previousDay);

    const results = await Promise.all(
      _.chain(orders)
        .groupBy('order.store.id')
        .map(async (value) => {
          const totalOrders = _.chain(value).groupBy('order.id').size().value();
          const quantity = value.reduce((acc, item) => acc + item.quantity, 0);
          const total = value.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );
          const moneyDiscount = value.reduce(
            (acc, item) =>
              acc + (item.discount / 100) * item.price * item.quantity,
            0,
          );

          const profits = await Promise.all(
            value.map(async (item) => {
              console.log(item);
              const productAttributeId =
                await this.ordersService.findOrderProductById(item.id);

              const { price, profit } =
                await this.productsService.profitByProductAttribute(
                  productAttributeId.id,
                );

              return (profit - (item.discount / 100) * price) * item.quantity;
            }),
          );
          const totalProfit = profits.reduce((acc, curr) => acc + curr, 0);

          return {
            storeId: value[0].order.store.id,
            orders: {
              totalOrders,
              quantity,
              total,
              moneyDiscount,
              totalProfit,
            },
          };
        })
        .value(),
    );

    return results;
  }

  private async createStatistic(
    createStatisticDto: CreateStatisticDto,
  ): Promise<StatisticResponseDto> {
    let statistic = this.statisticRepository.create(createStatisticDto);
    statistic = await this.statisticRepository.save(statistic);

    return {
      id: statistic.id,
      totalProducts: statistic.totalProducts,
      totalRevenue: statistic.totalRevenue,
      totalDiscount: statistic.totalDiscount,
      totalOrders: statistic.totalOrders,
      totalProfit: statistic.totalProfit,
      startDate: statistic.startDate,
      endDate: statistic.endDate,
    };
  }
}
