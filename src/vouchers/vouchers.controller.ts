import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from 'src/users/entities/store.entity';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';

@Controller('vouchers')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  async create(
    @Body() createVoucherDto: CreateVoucherDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.vouchersService.create(createVoucherDto, currentStore);
  }

  @Get('paginate')
  async findAllPagination(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.vouchersService.findAllPagination(
      currentStore,
      page,
      limit,
    );
  }

  @Get('list_voucher')
  getVouchersByTotal(
    @Query('total') total: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    const totalAsNumber = Number(total);
    return this.vouchersService.getVouchersByTotal(totalAsNumber, currentStore);
  }

  @Get()
  async findAll(@CurrentStore() currentStore: StoreEntity) {
    return await this.vouchersService.findAll(currentStore);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentStore() currentStore: StoreEntity) {
    return this.vouchersService.findOne(id, currentStore);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.vouchersService.update(
      id,
      updateVoucherDto,
      currentStore,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.vouchersService.remove(id);
  }
}
