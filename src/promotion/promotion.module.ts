import { forwardRef, Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionEntity } from './entities/promotion.entity';
import { ProductsModule } from '../products/products.module';
import { ProductAttributeEntity } from '../products/entities/product-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromotionEntity, ProductAttributeEntity]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
