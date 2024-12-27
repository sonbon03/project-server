import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { NotificationEntity } from './entities/notification.entity';
import { PoolEntity } from './entities/pool.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { StoreEntity } from 'src/store/entities/store.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifiRepository: Repository<NotificationEntity>,
    @InjectRepository(PoolEntity)
    private readonly poolRepository: Repository<PoolEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createPool(createPool: CreatePoolDto, currentUser: UserEntity) {
    for (const storeId of createPool.listStores) {
      try {
        await this.usersService.getStore(storeId, currentUser);
      } catch (error) {
        throw new BadRequestException('Store not found!');
      }
    }

    let pool = await this.poolRepository.create(createPool);
    pool.user = currentUser;
    pool = await this.poolRepository.save(pool);
    return pool;
  }

  async getNotiForStore(currentStore: StoreEntity) {
    const recentNoti = await this.notifiRepository.find({
      where: { store: { id: currentStore.id } },
      order: { createdAt: 'DESC' },
    });

    if (recentNoti.length === 0) {
      return recentNoti;
    }

    const time = new Date(recentNoti[0].timePool);

    const pools = await this.poolRepository.find({
      where: {
        user: { id: currentStore.id },
        createdAt: MoreThan(time),
      },
    });
    if (!pools) {
      return recentNoti;
    } else {
      for (const pool of pools) {
        const noti: CreateNotificationDto = {
          title: pool.title,
          message: pool.message,
          timePool: new Date(pool.createdAt.toString()),
        };
        await this.createNotify(noti, currentStore);
      }
    }

    return recentNoti;
  }

  async createNotify(
    createNoti: CreateNotificationDto,
    currentStore: StoreEntity,
  ) {
    let noti = await this.notifiRepository.create(createNoti);
    noti.store = currentStore;
    noti = await this.notifiRepository.save(noti);
    return noti;
  }
}
