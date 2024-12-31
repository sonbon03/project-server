import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeEntity } from 'src/products/entities/product-attribute.entity';
import { ProductsModule } from 'src/products/products.module';
import { PromotionEntity } from './entities/promotion.entity';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromotionEntity, ProductAttributeEntity]),
    ProductsModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
