import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from './entities/store.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('customer')
  async createCustomer(
    @CurrentStore() currentStore: StoreEntity,
    @Body() createCustomer: CreateCustomerDto,
  ) {
    return await this.storeService.createCustomer(currentStore, createCustomer);
  }

  @Get('customer/paginate')
  async getCustomerPaginate(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.storeService.getCustomerPaginate(
      currentStore,
      page,
      limit,
    );
  }

  @Get('customer/all')
  async getAllCustomer(@CurrentStore() currentStore: StoreEntity) {
    return await this.storeService.getAllCustomer(currentStore);
  }

  @Get('customer/:id')
  async getInforCustomerByStore(
    @CurrentStore() currentStore: StoreEntity,
    @Query('id') id: string,
  ) {
    return await this.storeService.getInforCustomerByStore(currentStore, id);
  }

  @Delete('customer')
  async removeCustomer(
    @CurrentStore() currentStore: StoreEntity,
    @Query('id') id: string,
  ) {
    return await this.storeService.removeCustomer(currentStore, id);
  }

  @Patch('customer/:id')
  async updateCustomer(
    @CurrentStore() currentStore: StoreEntity,
    @Query('id') id: string,
    @Body() updateCustomer: UpdateCustomerDto,
  ) {
    return await this.storeService.updateCustomer(
      currentStore,
      id,
      updateCustomer,
    );
  }
}
