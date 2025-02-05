import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('pool')
@Index(['listStores', 'createdAt'], { unique: true })
export class PoolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { array: true })
  listStores: string[];

  @Column()
  title: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Timestamp;
}
