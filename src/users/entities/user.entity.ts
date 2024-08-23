import { Roles } from 'src/utils/enums/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StoreEntity } from './store.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.ADMIN] })
  roles: Roles;

  @Column({ type: 'uuid', nullable: true })
  storeId: string;

  @OneToOne(() => StoreEntity, (store) => store.user, { cascade: true })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;
}
