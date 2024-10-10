import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { StoreEntity } from '../users/entities/store.entity';
import { checkText } from '../utils/common/CheckText';

jest.mock('../utils/common/CheckText'); // Mock the entire module

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<CategoryEntity>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockStore = new StoreEntity();
  mockStore.id = 'store-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      const categoryEntity = new CategoryEntity();
      categoryEntity.name = createCategoryDto.name.toLowerCase();
      mockCategoryRepository.find.mockResolvedValue([]); // no category exists
      mockCategoryRepository.create.mockReturnValue(categoryEntity);
      mockCategoryRepository.save.mockResolvedValue(categoryEntity);

      const result = await service.create(createCategoryDto, mockStore);

      expect(result).toEqual(categoryEntity);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { name: 'new category', store: { id: mockStore.id } },
      });
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(categoryEntity);
    });

    it('should throw BadRequestException if category already exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Existing Category',
      };
      mockCategoryRepository.find.mockResolvedValue([new CategoryEntity()]); // category already exists

      await expect(
        service.create(createCategoryDto, mockStore),
      ).rejects.toThrow(BadRequestException);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { name: 'existing category', store: { id: mockStore.id } },
      });
    });

    it('should throw BadRequestException if the category name contains special characters', async () => {
      (checkText as jest.Mock).mockReturnValue(true); // Mock the checkText function to return true
      const createCategoryDto: CreateCategoryDto = { name: 'Invalid@Category' };

      await expect(
        service.create(createCategoryDto, mockStore),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
