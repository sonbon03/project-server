import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ImageModule } from './image/image.module';
import { MailService } from './mail/mail.service';
import { NotificationModule } from './notification/notification.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PromotionModule } from './promotion/promotion.module';
import { StatisticModule } from './statistic/statistic.module';
import { StoreModule } from './store/store.module';
import { UsersModule } from './users/users.module';
import { CurrentStoreMiddleware } from './utils/middlewares/current-store.middleware';
import { CurrentUserMiddleware } from './utils/middlewares/current-user.middleware';
import { VouchersModule } from './vouchers/vouchers.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    UsersModule,
    WarehousesModule,
    CategoriesModule,
    ProductsModule,
    PromotionModule,
    OrdersModule,
    VouchersModule,
    StatisticModule,
    NotificationModule,
    StoreModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, CurrentStoreMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
