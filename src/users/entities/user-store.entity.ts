import { StoreEntity } from 'src/store/entities/store.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_store')
export class UserStoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  storeId: string;

  @Column({ nullable: true })
  adminId?: string;

  @ManyToOne(() => UserEntity, (user) => user.user_store, {
    cascade: true,
  })
  user: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.user_store, {
    cascade: true,
  })
  store: StoreEntity;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
