import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseEntity } from './entities/warehouse.entity';
import { CurrentStore } from '../utils/decoratores/current-store.decoratore';
import { StoreEntity } from '../users/entities/store.entity';
import { AuthorizeGuard } from '../utils/guards/authorization.guard';
import { Roles } from '../utils/enums/user-roles.enum';
import { AuthenticationGuard } from '../utils/guards/authentication.guard';

@Controller('warehouses')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<WarehouseEntity> {
    return await this.warehousesService.create(
      createWarehouseDto,
      currentStore,
    );
  }

  @Get()
  async findAll(@CurrentStore() currentStore: StoreEntity) {
    return await this.warehousesService.findAll(currentStore);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.warehousesService.findOne(id, currentStore);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<any> {
    return await this.warehousesService.update(
      id,
      updateWarehouseDto,
      currentStore,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.warehousesService.remove(id);
  }
}
