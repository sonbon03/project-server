import { PoolEntity } from 'src/notification/entities/pool.entity';
import { Gender } from 'src/utils/enums/user-gender.enum';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
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
import { UserStoreEntity } from './user-store.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.ADMIN })
  roles: Roles;

  @Column({ nullable: true })
  last_name?: string;

  @Column()
  first_name: string;

  @Column()
  phone: string;

  @Column({ nullable: true, default: 0 })
  point?: string;

  @Column({ nullable: true })
  salary?: string;

  @Column({ nullable: true, default: 0 })
  quantityOrder?: number;

  @Column({ nullable: true })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: true,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'uuid', nullable: true })
  emailVerificationToken: string | null;

  @OneToMany(() => PoolEntity, (pool) => pool.user)
  pools: PoolEntity[];

  @OneToMany(() => UserStoreEntity, (userStore) => userStore.user, {
    onDelete: 'CASCADE',
  })
  user_store: UserStoreEntity[];
}
