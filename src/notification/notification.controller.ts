import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { CurrentUser } from 'src/utils/decoratores/current-user.decoratore';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreatePoolDto } from './dto/create-pool.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { PoolEntity } from './entities/pool.entity';
import { StoreEntity } from 'src/store/entities/store.entity';

@Controller('notification')
@UseGuards(AuthenticationGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async createPool(
    @Body() createPool: CreatePoolDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<PoolEntity> {
    return await this.notificationService.createPool(createPool, currentUser);
  }

  @UseGuards(AuthorizeGuard([Roles.MODERATOR, Roles.ADMIN]))
  @Get()
  async getNotiForStore(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<NotificationEntity[]> {
    return await this.notificationService.getNotiForStore(currentStore);
  }
}
