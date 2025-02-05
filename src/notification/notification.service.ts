import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { NotificationEntity } from './entities/notification.entity';
import { PoolEntity } from './entities/pool.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { StoreEntity } from 'src/store/entities/store.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifiRepository: Repository<NotificationEntity>,
    @InjectRepository(PoolEntity)
    private readonly poolRepository: Repository<PoolEntity>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async createPool(createPool: CreatePoolDto) {
    for (const storeId of createPool.listStores) {
      try {
        await this.usersService.checkStore(storeId);
      } catch (error) {
        throw new BadRequestException('Store not found!');
      }
    }

    const pool = await this.poolRepository.save(createPool);
    return pool;
  }

  async getNotiForStore(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const recentNoti = await this.notifiRepository.find({
      where: { store: { id: currentStore.id } },
      order: { createdAt: 'DESC' },
    });

    let time;
    let pools;
    if (recentNoti.length > 0) {
      time = new Date(recentNoti[0].timePool);
      pools = await this.poolRepository.find({
        where: {
          createdAt: MoreThan(time),
        },
      });
    } else {
      time = null;
      pools = await this.poolRepository.find();
    }

    if (!!pools) {
      return await this.getAllNotify(currentStore, page, limit);
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

    return await this.getAllNotify(currentStore, page, limit);
  }

  async getAllNotify(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const [list, total] = await this.notifiRepository.findAndCount({
      where: { store: { id: currentStore.id } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);
    const resultArray = await Promise.all(
      list.map(async (item) => {
        const parsedAttributes = JSON.parse(item.message);
        return Promise.all(
          parsedAttributes.map(async (attribute: any) => {
            const { product, attribute: attr } =
              await this.productsService.getInfoAttribute(
                attribute.id_attribute,
              );
            return {
              name: `${product.name} ${attr.value}`,
              amount: attribute.amount,
            };
          }),
        );
      }),
    );

    const result = list.map((item, index) => ({
      ...item,
      message: JSON.stringify(resultArray[index]),
    }));

    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
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
