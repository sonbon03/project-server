import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StoreCustomerEntity } from './entities/store-customer.entity';
import { StoreEntity } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, StoreCustomerEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
