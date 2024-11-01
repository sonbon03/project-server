import { IsDate, IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNumber()
  totalProducts: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalRevenue: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalDiscount: number;

  @IsNumber()
  totalOrders: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
