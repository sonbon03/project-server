import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { PromotionModule } from '../promotion/promotion.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
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
    forwardRef(() => PromotionModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
