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
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from 'src/users/entities/store.entity';
import { PromotionEntity } from './entities/promotion.entity';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';

@Controller('promotion')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<PromotionEntity | PromotionEntity[]> {
    return await this.promotionService.create(createPromotionDto, currentStore);
  }

  @Get()
  findAll(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<PromotionEntity[]> {
    return this.promotionService.findAll(currentStore);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<PromotionEntity> {
    return this.promotionService.findOne(id, currentStore);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<PromotionEntity> {
    return this.promotionService.update(id, updatePromotionDto, currentStore);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promotionService.remove(id);
  }
}
