import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { StoreEntity } from '../../users/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderProductEntity } from './order-product.entity';
import { PaymentEntity } from './payment.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  quantityProduct: number;

  @Column()
  timeBuy: Date;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  moneyDiscount: number;

  @ManyToOne(() => StoreEntity, (store) => store.orders)
  store: StoreEntity;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => EmployeeEntity, (emp) => emp.orders)
  employee: EmployeeEntity;

  @OneToMany(() => OrderProductEntity, (orProd) => orProd.order)
  orderProducts: OrderProductEntity[];

  @OneToOne(() => PaymentEntity, (payment) => payment.order, { cascade: true })
  @JoinColumn()
  payment: PaymentEntity;
}
