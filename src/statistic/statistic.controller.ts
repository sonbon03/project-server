import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from 'src/users/entities/store.entity';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { CurrentUser } from 'src/utils/decoratores/current-user.decoratore';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('statistic')
@UseGuards(AuthenticationGuard)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @UseGuards(AuthorizeGuard([Roles.ADMIN]))
  @Get('all/week')
  async getStatisticsAllStoreByMonth(
    @Query('date') date: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
    return await this.statisticService.getStatisticsAllStoreByMonth(
      new Date(date),
      currentUser,
    );
  }

  @Get('all/month')
  async getStatisticsAllStoreByWeek(
    @Query('date') date: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
    return await this.statisticService.getStatisticsAllStoreByWeek(
      new Date(date),
      currentUser,
    );
  }

  @Get('all/year')
  async getStatisticsAllStoreByYear(
    @Query('date') date: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<
    {
      idStore: string;
      name: string;
      statistics: StatisticResponseDto;
    }[]
  > {
    return await this.statisticService.getStatisticsAllStoreByYear(
      new Date(date),
      currentUser,
    );
  }

  @UseGuards(AuthorizeGuard([Roles.MODERATOR]))
  @Get('/week')
  async getStatisticsForWeek(
    @Query('date') date: string,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByWeek(
      new Date(date),
      currentStore,
    );
  }

  @Get('/month')
  async getStatisticsForMonth(
    @Query('date') date: string,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByMonth(
      new Date(date),
      currentStore,
    );
  }

  @Get('/year')
  async getStatisticsForDay(
    @Query('date') date: string,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByYear(
      new Date(date),
      currentStore,
    );
  }
}
