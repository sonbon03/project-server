import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEnity } from './entities/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherEnity])],
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
