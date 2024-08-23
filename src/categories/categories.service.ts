import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';

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
      where: { name: nameLower },
    });
    if (categoryExists.length > 0)
      throw new BadRequestException('Category was exists');
    createCategoryDto.name = nameLower;
    let category = await this.categoryRepository.create(createCategoryDto);
    category.store = currentStore;
    category = await this.categoryRepository.save(category);
    return category;
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) throw new BadRequestException('Category not found!');
    return category;
  }

  async update(
    id: string,
    fields: Partial<UpdateCategoryDto>,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new BadRequestException('Category not found!');
    const nameLower = fields.name.toLowerCase();
    const categoryExists = await this.categoryRepository.find({
      where: { name: nameLower },
    });
    if (categoryExists) throw new BadRequestException('Category was exists');
    fields.name = nameLower;
    Object.assign(category, fields);

    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) throw new BadRequestException('Category not found!');
    return this.categoryRepository.delete(id);
  }
}
