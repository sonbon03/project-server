import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { ProductsService } from './products.service';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { StoreEntity } from 'src/store/entities/store.entity';

@Controller('products')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductAttributeDto: CreateProductAttributeDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<any> {
    return await this.productsService.create(
      createProductAttributeDto,
      currentStore,
    );
  }

  @Get('paginate')
  async findAllProductPagination(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.findAllProductPagination(
      currentStore,
      page,
      limit,
    );
  }

  @Get()
  async findAll(@CurrentStore() currentStore: StoreEntity) {
    return await this.productsService.findAll(currentStore);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.productsService.findOne(id, currentStore);
  }

  @Get('product-attribute/:id')
  async findOneProductAttribute(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return this.productsService.findOneProductAttribute(id, currentStore);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductAttributeDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.productsService.update(
      id,
      updateProductDto,
      currentStore,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
