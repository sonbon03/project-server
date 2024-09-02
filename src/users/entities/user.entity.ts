import { Roles } from 'src/utils/enums/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminEntity } from './admin.entity';
import { StoreEntity } from './store.entity';
import { Status } from 'src/utils/enums/user-status.enum';

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

  // @Column({ nullable: true })
  // firstName: string;

  // @Column({ nullable: true })
  // lastName: string;

  // @Column({ nullable: true })
  // birthday: Date;

  // @Column({ type: 'enum', enum: Gender, nullable: true })
  // gender: Gender;

  // @Column({ nullable: true })
  // phone: string;

  // @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  // salary: number;

  @Column({ type: 'uuid', nullable: true })
  storeId: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @OneToOne(() => StoreEntity, (store) => store.user, {
    nullable: true,
  })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ type: 'uuid', nullable: true })
  emailVerificationToken: string | null;

  // @Column({ default: false })
  // emailVerified: boolean;

  @ManyToOne(() => AdminEntity, (admin) => admin.users)
  admin: AdminEntity;
}
