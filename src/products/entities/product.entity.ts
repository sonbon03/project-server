import { CategoryEntity } from 'src/categories/entities/category.entity';
import { WarehouseEntity } from 'src/warehouses/entities/warehouse.entity';
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
import { v4 as uuidv4 } from 'uuid';
import { ProductAttributeEntity } from './product-attribute.entity';
import { StoreEntity } from 'src/users/entities/store.entity';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  expiryDay: Date;

  @Column({ type: 'date', nullable: true })
  manufactureDate: Date | null;

  @Column()
  measure: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => CategoryEntity, (cate) => cate.products)
  category: CategoryEntity;

  @ManyToOne(() => WarehouseEntity, (ware) => ware.products)
  warehouse: WarehouseEntity;

  @OneToMany(() => ProductAttributeEntity, (prodAttri) => prodAttri.product, {
    cascade: true,
  })
  productAttributes: ProductAttributeEntity[];

  @ManyToOne(() => PromotionEntity, (prom) => prom.products, { cascade: true })
  promotion: PromotionEntity;

  @ManyToOne(() => StoreEntity, (store) => store.products)
  store: StoreEntity;
}
