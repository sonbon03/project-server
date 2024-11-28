import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StoreEntity } from './store.entity';
import { PoolEntity } from 'src/notification/entities/pool.entity';

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

  @Column({ type: 'enum', enum: Roles, default: Roles.ADMIN })
  roles: Roles;

  @Column()
  name: string;

  @Column({ nullable: null })
  phone: string;

  @Column({ type: 'uuid', nullable: true })
  storeId: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @OneToMany(() => StoreEntity, (store) => store.user, {
    nullable: true,
  })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity[];

  @Column({ type: 'uuid', nullable: true })
  emailVerificationToken: string | null;
  user: StoreEntity;

  @OneToMany(() => PoolEntity, (pool) => pool.user)
  pools: PoolEntity[];
}
