import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'statistics' })
export class StatisticEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalProducts: number;

  @Column({ nullable: true })
  storeId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalRevenue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalDiscount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalProfit: number;

  @Column()
  totalOrders: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;
}
