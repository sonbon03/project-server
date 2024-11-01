import { CategoryEntity } from 'src/categories/entities/category.entity';
import { EmployeeEntity } from 'src/employees/entities/employee.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';
import { VoucherEnity } from 'src/vouchers/entities/voucher.entity';
import { WarehouseEntity } from 'src/warehouses/entities/warehouse.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';
import { StatisticEntity } from 'src/statistic/entities/statistic.entity';

@Entity('stores')
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  typeStore: string;

  @Column()
  address: string;

  @OneToOne(() => UserEntity, (user) => user.store, { cascade: true })
  user: UserEntity;

  @OneToMany(() => EmployeeEntity, (emp) => emp.store)
  employees: EmployeeEntity[];

  @OneToMany(() => WarehouseEntity, (ware) => ware.store)
  warehouse: WarehouseEntity[];

  @OneToMany(() => CategoryEntity, (cate) => cate.store)
  category: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.store)
  products: ProductEntity[];

  @OneToMany(() => PromotionEntity, (prom) => prom.store)
  promotions: PromotionEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];

  @OneToMany(() => VoucherEnity, (vou) => vou.store)
  vouchers: VoucherEnity[];

  @OneToMany(() => StatisticEntity, (statis) => statis.store)
  statistics: StatisticEntity[];
}
