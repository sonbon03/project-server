import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductAttributeEntity } from './entities/product-attribute.entity';
import { AttributeEntity } from './entities/attribute.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductAttributeEntity,
      AttributeEntity,
    ]),
    CategoriesModule,
    WarehousesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
