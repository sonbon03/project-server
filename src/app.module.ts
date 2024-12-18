import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data';
import { CurrentUserMiddleware } from './utils/middlewares/current-user.middleware';
import { EmployeesModule } from './employees/employees.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { CurrentStoreMiddleware } from './utils/middlewares/current-store.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrdersModule } from './orders/orders.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { MailService } from './mail/mail.service';
import { StatisticModule } from './statistic/statistic.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    EmployeesModule,
    WarehousesModule,
    CategoriesModule,
    ProductsModule,
    PromotionModule,
    OrdersModule,
    VouchersModule,
    StatisticModule,
    NotificationModule,
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
