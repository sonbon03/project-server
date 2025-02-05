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

  @Column()
  value: string;

  @Column({ type: 'enum', enum: StatusAttibute })
  status: StatusAttibute;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  expiryDay: Date;

  @Column({ type: 'date' })
  manufactureDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  priceImport: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProductAttributeEntity, (prodAttri) => prodAttri.attribute)
  productAttributes: ProductAttributeEntity[];
}
