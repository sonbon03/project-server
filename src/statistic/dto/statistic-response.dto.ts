import { StoreEntity } from 'src/users/entities/store.entity';

export class StatisticResponseDto {
  id: string;
  totalProducts: number;
  totalRevenue: number;
  totalDiscount: number;
  totalOrders: number;
  startDate: Date;
  endDate: Date;
  store?: StoreEntity;
}
