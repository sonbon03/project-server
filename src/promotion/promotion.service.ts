import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoreEntity } from 'src/users/entities/store.entity';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionEntity } from './entities/promotion.entity';
import { ProductAttributeEntity } from 'src/products/entities/product-attribute.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>,
    @InjectRepository(ProductAttributeEntity)
    private readonly productAttributeRepository: Repository<ProductAttributeEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    createPromotionDto: CreatePromotionDto,
    currentStore: StoreEntity,
  ): Promise<PromotionEntity> {
    if (createPromotionDto.startDay > createPromotionDto.endDay)
      throw new BadRequestException(
        'The start day must be less than the end day',
      );

    let promotion;
    for (let i = 0; i < createPromotionDto.product_id.length; i++) {
      const product = await this.productsService.findOneProductAttribute(
        createPromotionDto.product_id[i],
      );
      if (product.promotion === null) {
        promotion = await this.promotionRepository.create(createPromotionDto);
        promotion.store = currentStore;
        promotion = await this.promotionRepository.save(promotion);
        await this.productsService.addPromotion(
          createPromotionDto.product_id[i],
          promotion,
        );
      } else {
        promotion = await this.update(
          product.promotion.id,
          createPromotionDto,
          currentStore,
        );
      }
    }
    return await this.findOne(promotion.id, currentStore);
  }

  async findAll(currentStore: StoreEntity): Promise<PromotionEntity[]> {
    return await this.promotionRepository.find({
      where: { store: { id: currentStore.id } },
    });
  }

  async findAllPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.promotionRepository.findAndCount({
      where: { store: { id: currentStore.id } },
      relations: {
        products: true,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findOne(
    id: string,
    currentStore: StoreEntity,
  ): Promise<PromotionEntity> {
    const promotion = await this.promotionRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
    });
    if (!promotion) throw new BadRequestException('Promotion not found');
    return promotion;
  }

  async update(
    id: string,
    fields: Partial<UpdatePromotionDto>,
    currentStore: StoreEntity,
  ): Promise<PromotionEntity> {
    const promotion = await this.findOne(id, currentStore);

    Object.assign(promotion, fields);
    promotion.store = currentStore;

    const data = await this.promotionRepository.save(promotion);

    return data;
  }

  async remove(id: string) {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) {
      throw new Error(`Promotion không tồn tại`);
    }
    await this.productAttributeRepository
      .createQueryBuilder()
      .update(ProductAttributeEntity)
      .set({ promotion: null })
      .where('promotionId = :id', { id })
      .execute();

    return await this.promotionRepository.delete(id);
  }
}
