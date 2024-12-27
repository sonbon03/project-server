import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('store_customer')
export class StoreCustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  storeId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  point?: number;

  @Column({ default: 0 })
  quantityOrder?: string;

  @ManyToOne(() => UserEntity, (user) => user.user_store, {
    cascade: true,
  })
  user: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.user_store, {
    cascade: true,
  })
  store: StoreEntity;

  @OneToMany(() => OrderEntity, (order) => order.store_customer, {
    onDelete: 'CASCADE',
  })
  orders: OrderEntity[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
