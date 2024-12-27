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
import { StoreCustomerEntity } from 'src/store/entities/store-customer.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  quantityProduct: number;

  @Column()
  timeBuy: Date;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  moneyDiscount: number;

  @ManyToOne(() => StoreCustomerEntity, (store) => store.orders, {
    onDelete: 'CASCADE',
  })
  store_customer: StoreCustomerEntity;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => OrderProductEntity, (orProd) => orProd.order)
  orderProducts: OrderProductEntity[];

  @OneToOne(() => PaymentEntity, (payment) => payment.order, { cascade: true })
  @JoinColumn()
  payment: PaymentEntity;
}
