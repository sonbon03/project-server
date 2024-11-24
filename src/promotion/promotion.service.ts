import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoreEntity } from 'src/users/entities/store.entity';
import { checkText } from 'src/utils/common/CheckText';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionEntity } from './entities/promotion.entity';

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
  ): Promise<PromotionEntity> {
    if (createPromotionDto.startDay > createPromotionDto.endDay)
      throw new BadRequestException(
        'The start day must be less than the end day',
      );
    if (checkText(createPromotionDto.name)) {
      throw new BadRequestException(
        'The promotion contains special characters',
      );
    }
    const checkPromotion = await this.promotionRepository.findOne({
      where: {
        key: createPromotionDto.key,
        store: { id: currentStore.id },
      },
    });
    if (checkPromotion) {
      throw new BadRequestException('Promotion exists');
    }
    let promotion;
    for (let i = 0; i < createPromotionDto.product_id.length; i++) {
      const product = await this.productsService.findOneProductAttribute(
        createPromotionDto.product_id[i],
        currentStore,
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
    const checkPromotion = await this.promotionRepository.findOne({
      where: {
        key: fields.key,
        store: { id: currentStore.id },
      },
    });
    if (checkPromotion) {
      throw new BadRequestException('Promotion exists');
    }
    const promotion = await this.findOne(id, currentStore);

    Object.assign(promotion, fields);
    promotion.store = currentStore;

    const data = await this.promotionRepository.save(promotion);

    return data;
  }

  async checkTimePromotion(id: string) {
    const promotions = await this.promotionRepository.find({
      where: { id: id },
    });
    if (!promotions) {
      throw new BadRequestException('Promotion not found');
    } else {
      const now = new Date();
      promotions.map(async (item) => {
        const start = new Date(item.startDay);
        const end = new Date(item.endDay);
        if (now > end) {
          await this.productsService.removePromotionProducts(item.id);
          return [];
        }
        if (now < start) {
          throw new BadRequestException('Promotion not start yet');
        }
      });
      return { data: promotions };
    }
  }

  async remove(id: string) {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) {
      throw new Error(`Promotion không tồn tại`);
    }
    await this.productsService.removePromotionProducts(promotion.id);

    return await this.promotionRepository.delete(id);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCheckTime() {
    const activePromotions = await this.promotionRepository.find();

    await Promise.all(
      activePromotions.map(async (promotion) => {
        try {
          await this.checkTimePromotion(promotion.id);
        } catch (error) {
          throw new BadRequestException(
            `Error checking promotion with ID ${promotion.id}:`,
          );
        }
      }),
    );
  }
}
