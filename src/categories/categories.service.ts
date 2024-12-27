import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { checkText } from 'src/utils/common/CheckText';
import { StoreEntity } from 'src/store/entities/store.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    const checkKey = await this.categoryRepository.find({
      where: { key: createCategoryDto.key, store: { id: currentStore.id } },
    });
    if (checkKey) throw new BadRequestException('Category was exists');
    if (checkText(createCategoryDto.name)) {
      throw new BadRequestException(
        'The category name contains special characters',
      );
    }
    let category = await this.categoryRepository.create(createCategoryDto);
    category.store = currentStore;
    category = await this.categoryRepository.save(category);
    return category;
  }

  async findAll(currentStore: StoreEntity): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { store: { id: currentStore.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    id: string,
    currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
    });
    if (!category) throw new BadRequestException('Category not found!');
    return category;
  }

  async update(
    id: string,
    fields: Partial<UpdateCategoryDto>,
    currentStore: StoreEntity,
  ): Promise<CategoryEntity> {
    const checkKey = await this.categoryRepository.find({
      where: { key: fields.key, store: { id: currentStore.id } },
    });
    if (checkKey) throw new BadRequestException('Category was exists');

    const category = await this.findOne(id, currentStore);
    if (!category) throw new BadRequestException('Category not found!');

    Object.assign(category, fields);

    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found!');
    return this.categoryRepository.delete(id);
  }
}
