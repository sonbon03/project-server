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
import { UpdateAmountAttributeDto } from './dto/update-amount-attribute.dto';

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

  @Get('all')
  async getNameAll(@CurrentStore() currentStore: StoreEntity) {
    return await this.productsService.getNameAll(currentStore);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.productsService.findOne(id, currentStore);
  }

  @Get('attribute/:id_product/:id_attribute')
  async findOneAttribute(
    @Param('id_product') id_product: string,
    @Param('id_attribute') id_attribute: string,
  ) {
    return await this.productsService.findOneAttribute(
      id_product,
      id_attribute,
    );
  }

  @Get('product-attribute/:id')
  async findOneProductAttribute(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return this.productsService.findOneProductAttribute(id, currentStore);
  }

  @Patch('amount/attribute')
  async updateAmountAttribute(
    @Body() updateAmountAttributes: UpdateAmountAttributeDto[],
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.productsService.updateAmountAttribute(
      updateAmountAttributes,
      currentStore,
    );
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
