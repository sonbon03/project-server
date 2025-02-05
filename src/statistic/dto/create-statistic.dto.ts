import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateStatisticDto {
  @IsString()
  storeId: string;

  @IsNumber()
  totalProducts: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalRevenue: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalDiscount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalProfit: number;

  @IsNumber()
  totalOrders: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
