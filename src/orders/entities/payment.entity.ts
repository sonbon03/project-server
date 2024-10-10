import { PaymentMethod } from '../../utils/enums/payment-method.enum';
import { StatusPayment } from '../../utils/enums/user-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderEntity } from './order.entity';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  paymentMethod: PaymentMethod;

  @Column()
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  total: number;

  @Column({ type: 'enum', enum: StatusPayment })
  status: StatusPayment;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToOne(() => OrderEntity, (order) => order.payment)
  order: OrderEntity;
}
