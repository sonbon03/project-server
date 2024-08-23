import { StatusAttibute } from 'src/utils/enums/user-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductAttributeEntity } from './product-attribute.entity';

@Entity({ name: 'attributes' })
export class AttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  key: string;

  @Column({ type: 'enum', enum: StatusAttibute })
  status: StatusAttibute;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductAttributeEntity, (prodAttri) => prodAttri.attribute)
  productAttributes: ProductAttributeEntity[];
}
