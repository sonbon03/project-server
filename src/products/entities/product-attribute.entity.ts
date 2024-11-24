import { OrderProductEntity } from 'src/orders/entities/order-product.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AttributeEntity } from './attribute.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_attribute' })
export class ProductAttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => AttributeEntity, (attri) => attri.productAttributes, {
    cascade: true,
  })
  attribute: AttributeEntity;

  @ManyToOne(() => ProductEntity, (prod) => prod.productAttributes)
  product: ProductEntity;

  @OneToMany(
    () => OrderProductEntity,
    (orderProd) => orderProd.productAttribute,
  )
  orderProducts: OrderProductEntity[];
}
