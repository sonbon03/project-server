import { ProductAttributeEntity } from '../../products/entities/product-attribute.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_product' })
export class OrderProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @Column()
  discount: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => OrderEntity, (order) => order.orderProducts)
  order: OrderEntity;

  @ManyToOne(
    () => ProductAttributeEntity,
    (prodAttri) => prodAttri.orderProducts,
    { cascade: true },
  )
  productAttribute: ProductAttributeEntity;
}
