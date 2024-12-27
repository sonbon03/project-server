import { ProductEntity } from 'src/products/entities/product.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
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

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  key: string;

  @ManyToOne(() => StoreEntity, (store) => store.category)
  store: StoreEntity;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductEntity, (prod) => prod.category)
  products: ProductEntity[];
}
