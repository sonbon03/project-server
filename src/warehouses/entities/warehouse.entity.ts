import { ProductEntity } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StoreEntity } from '../../users/entities/store.entity';

@Entity({ name: 'warehouse' })
export class WarehouseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  limit: number;

  @ManyToOne(() => StoreEntity, (store) => store.warehouse)
  store: StoreEntity;

  @OneToMany(() => ProductEntity, (prod) => prod.warehouse)
  products: ProductEntity[];
}
