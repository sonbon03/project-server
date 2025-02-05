import { Controller, Get, UseGuards } from '@nestjs/common';
import { StoreEntity } from 'src/store/entities/store.entity';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
@UseGuards(AuthenticationGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @UseGuards(AuthorizeGuard([Roles.ADMIN]))
  // @Post()
  // async createPool(
  //   @Body() createPool: CreatePoolDto,
  //   @CurrentUser() currentUser: UserEntity,
  // ): Promise<PoolEntity> {
  //   return await this.notificationService.createPool(createPool, currentUser);
  // }

  @UseGuards(AuthorizeGuard([Roles.MODERATOR, Roles.ADMIN]))
  @Get()
  async getNotiForStore(@CurrentStore() currentStore: StoreEntity) {
    return await this.notificationService.getNotiForStore(currentStore);
  }
}
