import { Test, TestingModule } from '@nestjs/testing';
import { VouchersService } from './vouchers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VoucherEnity } from './entities/voucher.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { StoreEntity } from '../users/entities/store.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { checkText } from '../utils/common/CheckText';

jest.mock('../utils/common/CheckText');

describe('VouchersService', () => {
  let service: VouchersService;
  let vouchersRepository: Repository<VoucherEnity>;

  const mockVouchersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockStore = new StoreEntity();
  mockStore.id = 'store-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VouchersService,
        {
          provide: getRepositoryToken(VoucherEnity),
          useValue: mockVouchersRepository,
        },
      ],
    }).compile();

    service = module.get<VouchersService>(VouchersService);
    vouchersRepository = module.get<Repository<VoucherEnity>>(
      getRepositoryToken(VoucherEnity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if voucher name contains special characters', async () => {
      const createVoucherDto: CreateVoucherDto = {
        name: 'Invalid@Voucher',
        money: 50,
        limit_money: 100,
      };
      (checkText as jest.Mock).mockReturnValue(true); // Mock checkText to return true

      await expect(service.create(createVoucherDto, mockStore)).rejects.toThrow(
        BadRequestException,
      );
      expect(checkText).toHaveBeenCalledWith(createVoucherDto.name);
    });

    it('should throw BadRequestException if voucher name already exists', async () => {
      const createVoucherDto: CreateVoucherDto = {
        name: 'DuplicateVoucher',
        money: 50,
        limit_money: 100,
      };
      (checkText as jest.Mock).mockReturnValue(false); // Mock checkText to return false

      // Mock findOne to return a voucher with the same name
      (mockVouchersRepository.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'existing-voucher-id',
      });

      await expect(service.create(createVoucherDto, mockStore)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockVouchersRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'duplicatevoucher' },
      });
    });

    it('should create a new voucher successfully', async () => {
      const createVoucherDto: CreateVoucherDto = {
        name: 'ValidVoucher',
        money: 50,
        limit_money: 100,
      };
      (checkText as jest.Mock).mockReturnValue(false); // Mock checkText to return false
      (mockVouchersRepository.findOne as jest.Mock).mockResolvedValueOnce(null); // No existing voucher
      const newVoucher = { ...createVoucherDto, store: mockStore };
      (mockVouchersRepository.create as jest.Mock).mockReturnValue(newVoucher);
      (mockVouchersRepository.save as jest.Mock).mockResolvedValue(newVoucher);

      const result = await service.create(createVoucherDto, mockStore);

      expect(result).toEqual(newVoucher);
      expect(mockVouchersRepository.create).toHaveBeenCalledWith(
        createVoucherDto,
      );
      expect(mockVouchersRepository.save).toHaveBeenCalledWith(newVoucher);
    });
  });
});
