import { ProductAttributeEntity } from '../../products/entities/product-attribute.entity';
import { StoreEntity } from '../../users/entities/store.entity';
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

@Entity({ name: 'promotion' })
export class PromotionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  percentage: number;

  @Column()
  quantity: number;

  @Column()
  startDay: Date;

  @Column()
  endDay: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductAttributeEntity, (prod) => prod.promotion)
  products: ProductAttributeEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.promotions)
  store: StoreEntity;
}
