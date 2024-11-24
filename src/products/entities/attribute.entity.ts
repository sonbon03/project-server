import { StatusAttibute } from 'src/utils/enums/user-status.enum';
import {
  Check,
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

  @Column()
  value: string;

  @Column({ type: 'enum', enum: StatusAttibute })
  status: StatusAttibute;

  @Column()
  description: string;

  @Check('"amount" > 0')
  @Column()
  amount: number;

  @Check('"price" > 0')
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductAttributeEntity, (prodAttri) => prodAttri.attribute)
  productAttributes: ProductAttributeEntity[];
}
