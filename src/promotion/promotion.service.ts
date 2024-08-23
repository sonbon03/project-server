import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionEntity } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoreEntity } from 'src/users/entities/store.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    createPromotionDto: CreatePromotionDto,
    currentStore: StoreEntity,
  ) {
    if (createPromotionDto.start_day > createPromotionDto.end_day)
      throw new BadRequestException(
        'The start day must be less than the end day',
      );

    for (let i = 0; i < createPromotionDto.product_id.length; i++) {
      const product = await this.productsService.findOneProductAttribute(
        createPromotionDto.product_id[i],
      );
      if (product.promotion === null) {
        const promotion =
          await this.promotionRepository.create(createPromotionDto);
        promotion.store = currentStore;
        await this.promotionRepository.save(promotion);
      } else {
        await this.update(product.promotion.id, product.product);
      }
    }

    return 'This action adds a new promotion';
  }

  async findAll(currentStore: StoreEntity) {
    return await this.promotionRepository.find({
      where: { store: { id: currentStore.id } },
      relations: { store: true },
    });
  }

  async findOne(id: string) {
    const promotion = await this.promotionRepository.find({
      where: { id },
    });
    if (!promotion) throw new BadRequestException('Promotion not found');
    return promotion;
  }

  async update(id: string, fields: Partial<UpdatePromotionDto>) {
    const promotion = await this.promotionRepository.findOneBy({ id });

    if (!promotion) throw new BadRequestException('Promotion not found!');

    Object.assign(promotion, fields);

    return await this.promotionRepository.save(promotion);
  }

  remove(id: string) {
    return `This action removes a #${id} promotion`;
  }
}
