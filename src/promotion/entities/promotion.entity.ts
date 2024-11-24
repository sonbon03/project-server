import { ProductEntity } from 'src/products/entities/product.entity';
import { StoreEntity } from 'src/users/entities/store.entity';
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
  key: string;

  @Column()
  startDay: Date;

  @Column()
  endDay: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductEntity, (prod) => prod.promotion)
  products: ProductEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.promotions)
  store: StoreEntity;
}
