import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { AttributeEntity } from './entities/attribute.entity';
import { ProductAttributeEntity } from './entities/product-attribute.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

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
