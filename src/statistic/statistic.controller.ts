import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticResponseDto } from './dto/statistic-response.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('/day')
  async getStatisticsForDay(
    @Query('date') date: string,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByDay(new Date(date));
  }

  @Get('/week')
  async getStatisticsForWeek(
    @Query('date') date: string,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByWeek(new Date(date));
  }

  @Get('/month')
  async getStatisticsForMonth(
    @Query('date') date: string,
  ): Promise<StatisticResponseDto[]> {
    return await this.statisticService.getStatisticsByMonth(new Date(date));
  }
}
