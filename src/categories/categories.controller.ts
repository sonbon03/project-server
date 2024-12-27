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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { CategoryEntity } from './entities/category.entity';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { StoreEntity } from 'src/store/entities/store.entity';

@Controller('categories')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentStore);
  }

  @Get()
  async findAll(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll(currentStore);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(id, currentStore);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(
      id,
      updateCategoryDto,
      currentStore,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
