import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from './entities/store.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // @Post('customer')
  // async createCustomer(
  //   @CurrentStore() currentStore: StoreEntity,
  //   @Body() createCustomer: CreateCustomerDto,
  // ) {}
}
