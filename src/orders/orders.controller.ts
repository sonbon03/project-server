import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StoreEntity } from 'src/users/entities/store.entity';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { OrdersService } from './orders.service';
import { Response } from 'express';

@Controller('orders')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.ordersService.create(createOrderDto, currentStore);
  }

  @Get('paginate')
  async findAllPagination(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.ordersService.findAllPagination(
      currentStore,
      page,
      limit,
    );
  }

  @Get('export')
  async exportOrdersToExcel(
    @Res() res: Response,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<void> {
    await this.ordersService.exportDataOrder(res, currentStore);
  }

  @Get('export/docx')
  async exportOrdersToDocx(
    @Res() res: Response,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<void> {
    await this.ordersService.exportDocxOrder(res, currentStore);
  }

  @Get()
  findAll(@CurrentStore() currentStore: StoreEntity) {
    return this.ordersService.findAll(currentStore);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentStore() currentStore: StoreEntity) {
    return this.ordersService.findOne(id, currentStore);
  }

  @Put(':id')
  updateStatusPayment(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return this.ordersService.updateStatusPayment(
      id,
      updatePaymentStatusDto,
      currentStore,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
