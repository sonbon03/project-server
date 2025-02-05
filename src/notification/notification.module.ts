import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NotificationEntity } from './entities/notification.entity';
import { PoolEntity } from './entities/pool.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoolEntity, NotificationEntity]),
    UsersModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
