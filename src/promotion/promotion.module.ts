import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionEntity } from './entities/promotion.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductAttributeEntity } from 'src/products/entities/product-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromotionEntity, ProductAttributeEntity]),
    ProductsModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
