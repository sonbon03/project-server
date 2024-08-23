import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from 'src/users/entities/store.entity';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.promotionService.create(createPromotionDto, currentStore);
  }

  @Get()
  findAll(@CurrentStore() currentStore: StoreEntity) {
    return this.promotionService.findAll(currentStore);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}
