import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';
import { checkText } from 'src/utils/common/CheckText';

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
    const nameLower = createCategoryDto.name.toLowerCase();
    const categoryExists = await this.categoryRepository.find({
      where: { name: nameLower, store: { id: currentStore.id } },
    });
    if (categoryExists.length > 0)
      throw new BadRequestException('Category was exists');
    if (!checkText(createCategoryDto.name)) {
      throw new BadRequestException(
        'The category name contains special characters',
      );
    }
    createCategoryDto.name = nameLower;
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
    const category = await this.findOne(id, currentStore);
    if (!category) throw new BadRequestException('Category not found!');
    const nameLower = fields.name.toLowerCase();
    if (category.name !== fields.name) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { name: nameLower, store: { id: currentStore.id } },
      });
      if (categoryExists) throw new BadRequestException('Category was exists');
    }
    fields.name = nameLower;
    Object.assign(category, fields);

    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found!');
    return this.categoryRepository.delete(id);
  }
}
