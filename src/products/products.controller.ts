import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoreEntity } from 'src/users/entities/store.entity';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { ProductsService } from './products.service';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
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

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('product-attribute/:id')
  async findOneProductAttribute(@Param('id') id: string) {
    return this.productsService.findOneProductAttribute(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductAttributeDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
