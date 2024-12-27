import { ProductEntity } from 'src/products/entities/product.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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
