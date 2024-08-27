import { OrderEntity } from 'src/orders/entities/order.entity';
import { StoreEntity } from 'src/users/entities/store.entity';
import { Gender } from 'src/utils/enums/user-gender.enum';
import { Roles } from 'src/utils/enums/user-roles.enum';
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

@Entity('employees')
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  phone: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  point: number;

  @Column({ type: 'enum', enum: Roles })
  roles: Roles;

  @Column({ default: 0 })
  quantityOrder: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => StoreEntity, (store) => store.employees, { cascade: true })
  store: StoreEntity;

  @OneToMany(() => OrderEntity, (order) => order.employee)
  orders: OrderEntity[];
}
