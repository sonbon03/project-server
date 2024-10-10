import { CategoryEntity } from '../../categories/entities/category.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { OrderEntity } from '../../orders/entities/order.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { PromotionEntity } from '../../promotion/entities/promotion.entity';
import { VoucherEnity } from '../../vouchers/entities/voucher.entity';
import { WarehouseEntity } from '../../warehouses/entities/warehouse.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

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
}
