import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AttributeEntity } from './attribute.entity';
import { ProductEntity } from './product.entity';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';

@Entity({ name: 'product_attribute' })
export class ProductAttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => AttributeEntity, (attri) => attri.productAttributes, {
    onDelete: 'CASCADE',
  })
  attribute: AttributeEntity;

  @ManyToOne(() => ProductEntity, (prod) => prod.productAttributes)
  product: ProductEntity;

  @ManyToOne(() => PromotionEntity, (prom) => prom.products, { cascade: true })
  promotion: PromotionEntity;
}
