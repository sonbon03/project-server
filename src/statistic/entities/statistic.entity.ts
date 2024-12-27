import { StoreEntity } from 'src/store/entities/store.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'statistics' })
export class StatisticEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalProducts: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalRevenue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalDiscount: number;

  @Column()
  totalOrders: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @ManyToOne(() => StoreEntity, (store) => store.statistics, { nullable: true })
  store: StoreEntity;
}
