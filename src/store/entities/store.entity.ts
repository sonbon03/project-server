import { CategoryEntity } from 'src/categories/entities/category.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';
import { StatisticEntity } from 'src/statistic/entities/statistic.entity';
import { UserStoreEntity } from 'src/users/entities/user-store.entity';
import { VoucherEnity } from 'src/vouchers/entities/voucher.entity';
import { WarehouseEntity } from 'src/warehouses/entities/warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('stores')
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  typeStore: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => WarehouseEntity, (ware) => ware.store)
  warehouse: WarehouseEntity[];

  @OneToMany(() => CategoryEntity, (cate) => cate.store)
  category: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.store)
  products: ProductEntity[];

  @OneToMany(() => PromotionEntity, (prom) => prom.store)
  promotions: PromotionEntity[];

  @OneToMany(() => VoucherEnity, (vou) => vou.store)
  vouchers: VoucherEnity[];

  @OneToMany(() => StatisticEntity, (statis) => statis.store)
  statistics: StatisticEntity[];

  @OneToMany(() => NotificationEntity, (noti) => noti.store)
  notify: NotificationEntity[];

  @OneToMany(() => UserStoreEntity, (userStore) => userStore.store)
  user_store: UserStoreEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];
}
