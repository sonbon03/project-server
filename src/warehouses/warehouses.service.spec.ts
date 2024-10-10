import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { StoreEntity } from '../users/entities/store.entity';
import { UserEntity } from '../users/entities/user.entity';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let repository: Repository<WarehouseEntity>;

  const mockRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStore: StoreEntity = {
    id: '1',
    name: 'Test Store',
    typeStore: 'Retail',
    address: '123 Test St',
    user: new UserEntity(),
    employees: [],
    warehouse: [],
    category: [],
    products: [],
    promotions: [],
    orders: [],
    vouchers: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        {
          provide: getRepositoryToken(WarehouseEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    repository = module.get<Repository<WarehouseEntity>>(
      getRepositoryToken(WarehouseEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a warehouse successfully', async () => {
      const createWarehouseDto: CreateWarehouseDto = {
        name: 'Test Warehouse',
        limit: 100,
      };
      const expectedWarehouse = { ...createWarehouseDto, store: mockStore };

      jest.spyOn(mockRepository, 'find').mockResolvedValue([]);
      jest.spyOn(mockRepository, 'create').mockReturnValue(expectedWarehouse);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(expectedWarehouse);

      const result = await service.create(createWarehouseDto, mockStore);

      expect(result).toEqual(expectedWarehouse);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          name: createWarehouseDto.name.toUpperCase(),
          store: { id: mockStore.id },
        },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createWarehouseDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedWarehouse);
    });

    it('should throw BadRequestException if the warehouse name contains special characters', async () => {
      const createWarehouseDto: CreateWarehouseDto = {
        name: 'Invalid@Name',
        limit: 100,
      };

      await expect(
        service.create(createWarehouseDto, mockStore),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createWarehouseDto, mockStore),
      ).rejects.toThrow('The category name contains special characters');
    });

    it('should throw BadRequestException if the warehouse already exists', async () => {
      const createWarehouseDto: CreateWarehouseDto = {
        name: 'Test Warehouse',
        limit: 100,
      };

      jest.spyOn(mockRepository, 'find').mockResolvedValue([{}]); // Simulate existing warehouse

      await expect(
        service.create(createWarehouseDto, mockStore),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createWarehouseDto, mockStore),
      ).rejects.toThrow('Warehouse was exists');
    });
  });
});
