import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PromotionEntity } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { StoreEntity } from '../users/entities/store.entity';
import { BadRequestException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { checkText } from '../utils/common/CheckText';
import { ProductEntity } from 'src/products/entities/product.entity';
import { AttributeEntity } from 'src/products/entities/attribute.entity';

jest.mock('../utils/common/CheckText'); // Mocking checkText function

describe('PromotionService', () => {
  let service: PromotionService;
  let promotionRepository: Repository<PromotionEntity>;
  let productsService: ProductsService;

  const mockPromotionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  // Define the type of the mockProductsService to include the mock functions
  const mockProductsService: Partial<ProductsService> = {
    findOneProductAttribute: jest.fn() as jest.Mock<
      Promise<{
        product: ProductEntity;
        attributes: { [key: number]: AttributeEntity };
        promotion: PromotionEntity;
      }>
    >,
    addPromotion: jest.fn() as jest.Mock<Promise<void>>,
  };

  const mockStore = new StoreEntity();
  mockStore.id = 'store-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        {
          provide: getRepositoryToken(PromotionEntity),
          useValue: mockPromotionRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
    promotionRepository = module.get<Repository<PromotionEntity>>(
      getRepositoryToken(PromotionEntity),
    );
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new promotion successfully', async () => {
      const createPromotionDto: CreatePromotionDto = {
        name: 'Summer Sale',
        startDay: new Date('2024-01-01'),
        endDay: new Date('2024-01-10'),
        product_id: ['product1'],
        percentage: 10,
        quantity: 100,
      };

      const product = {
        id: 'a1e279ed-e886-4551-87a1-643eff44eb47',
        promotion: null,
      }; // No existing promotion
      const savedPromotion = new PromotionEntity();
      savedPromotion.id = '3f65c48c-f29d-4c11-b234-ad05ec3efc9b';

      // Mocking dependencies
      (productsService.findOneProductAttribute as jest.Mock).mockResolvedValue(
        product,
      );
      mockPromotionRepository.create.mockReturnValue(savedPromotion);
      mockPromotionRepository.save.mockResolvedValue(savedPromotion);
      (mockProductsService.addPromotion as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await service.create(createPromotionDto, mockStore);

      expect(result).toEqual(savedPromotion);
      expect(mockPromotionRepository.create).toHaveBeenCalledWith(
        createPromotionDto,
      );
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(savedPromotion);
    });

    it('should throw BadRequestException if startDay is greater than endDay', async () => {
      const createPromotionDto: CreatePromotionDto = {
        name: 'Winter Sale',
        startDay: new Date('2024-01-15'),
        endDay: new Date('2024-01-10'),
        product_id: ['product1'],
        percentage: 10,
        quantity: 100,
      };

      await expect(
        service.create(createPromotionDto, mockStore),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if promotion name contains special characters', async () => {
      const createPromotionDto: CreatePromotionDto = {
        name: 'Invalid@Promotion',
        startDay: new Date('2024-01-01'),
        endDay: new Date('2024-01-10'),
        product_id: ['product1'],
        percentage: 10,
        quantity: 100,
      };

      (checkText as jest.Mock).mockReturnValue(true); // Mock checkText to return true

      await expect(
        service.create(createPromotionDto, mockStore),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update existing promotion for a product', async () => {
      const createPromotionDto: CreatePromotionDto = {
        name: 'New Year Sale',
        startDay: new Date('2024-01-01'),
        endDay: new Date('2024-01-10'),
        product_id: ['product1'],
        percentage: 10,
        quantity: 100,
      };

      const existingPromotion = { id: '3f65c48c-f29d-4c11-b234-ad05ec3efc9b' }; // Existing promotion
      const product = {
        id: 'a1e279ed-e886-4551-87a1-643eff44eb47',
        promotion: existingPromotion,
      }; // Product with existing promotion
      const updatedPromotion = new PromotionEntity();
      updatedPromotion.id = '3f65c48c-f29d-4c11-b234-ad05ec3efc9b'; // ID for the updated promotion

      // Mocking dependencies
      (productsService.findOneProductAttribute as jest.Mock).mockResolvedValue(
        product,
      );
      mockPromotionRepository.findOne.mockResolvedValue(existingPromotion); // Mock findOne to return the existing promotion
      mockPromotionRepository.save.mockResolvedValue(updatedPromotion); // Mock save to return the updated promotion

      const result = await service.create(createPromotionDto, mockStore);

      expect(result).toEqual(updatedPromotion);
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(
        existingPromotion,
      ); // Check that save was called with existing promotion
    });
  });
});
