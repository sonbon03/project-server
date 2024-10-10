import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { StoreEntity } from './entities/store.entity';
import { AdminEntity } from './entities/admin.entity';
import { MailService } from '../mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { Repository, Timestamp } from 'typeorm';
import { TypeCurrent } from '../utils/middlewares/current-user.middleware';
import { Roles } from '../utils/enums/user-roles.enum';
import { Status } from '../utils/enums/user-status.enum';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockStoreRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockAdminRepository = {
  findOne: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UserEntity>;
  let storeRepository: Repository<StoreEntity>;
  let adminRepository: Repository<AdminEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(StoreEntity),
          useValue: mockStoreRepository,
        },
        {
          provide: getRepositoryToken(AdminEntity),
          useValue: mockAdminRepository,
        },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    storeRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    adminRepository = module.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );
  });

  describe('createModerator', () => {
    it('should create a moderator successfully', async () => {
      const createUserStoreDto: CreateUserStoreDto = {
        user: {
          email: 'moderator@example.com',
          password: 'strongpassword',
          id: '',
          createdAt: new Date() as unknown as Timestamp,
          updatedAt: new Date() as unknown as Timestamp,
          roles: Roles.SUPERADMIN,
          storeId: '',
          status: Status.PENDING,
          store: new StoreEntity(),
          emailVerificationToken: '',
          admin: new AdminEntity(),
        },
        store: {
          name: 'Test Store',
          typeStore: 'Retail', // Thêm loại cửa hàng
          address: '123 Test St',
          id: '',
          user: new UserEntity(),
          employees: [],
          warehouse: [],
          category: [],
          products: [],
          promotions: [],
          orders: [],
          vouchers: [],
        },
      };

      const mockStore: StoreEntity = {
        id: '0466c77e-6314-4c51-8664-9a4b159237b8',
        name: 'store 1',
        typeStore: '1',
        address: 'asaa',
        user: null, // Nếu không có user, có thể để null
        employees: [], // Mảng rỗng cho employees nếu không có
        warehouse: [], // Mảng rỗng cho warehouse nếu không có
        category: [], // Mảng rỗng cho category nếu không có
        products: [], // Mảng rỗng cho products nếu không có
        promotions: [], // Mảng rỗng cho promotions nếu không có
        orders: [], // Mảng rỗng cho orders nếu không có
        vouchers: [], // Mảng rỗng cho vouchers nếu không có
      } as StoreEntity;

      const currentAdmin: TypeCurrent = {
        idAdmin: '167f13c4-e46c-47e7-aeac-6089b76c3e86',
        idUser: '9e986ad5-a098-441d-badc-e92703bf4301',
        idStore: mockStore,
        roles: Roles.ADMIN,
      };

      const mockAdmin: AdminEntity = { id: 'admin-id' } as AdminEntity;

      // Thêm thuộc tính cần thiết cho UserEntity
      const mockUser: UserEntity = {
        id: 'user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['MODERATOR'], // Hoặc sử dụng enum nếu có
        email: createUserStoreDto.user.email,
        password: createUserStoreDto.user.password,
        // Thêm các thuộc tính khác nếu cần thiết
      } as unknown as UserEntity;

      mockAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockStoreRepository.create.mockReturnValue(createUserStoreDto.store);
      mockStoreRepository.save.mockResolvedValue(createUserStoreDto.store);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await usersService.createModerator(
        createUserStoreDto,
        currentAdmin,
      );

      expect(result).toEqual(mockUser);
      expect(mockStoreRepository.create).toHaveBeenCalledWith(
        createUserStoreDto.store,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        createUserStoreDto.user,
      );
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserStoreDto: CreateUserStoreDto = {
        user: {
          email: 'moderator@example.com',
          password: 'strongpassword',
          createdAt: new Date() as unknown as Timestamp, // Thêm ngày tạo
          updatedAt: new Date() as unknown as Timestamp, // Thêm ngày cập nhật
          roles: Roles.ADMIN,
          id: '',
          storeId: '',
          status: Status.ACTIVE,
          store: new StoreEntity(),
          emailVerificationToken: '',
          admin: new AdminEntity(),
        },
        store: {
          name: 'Test Store',
          typeStore: 'Retail',
          address: '123 Test St',
          id: '0466c77e-6314-4c51-8664-9a4b159237b8',
          user: new UserEntity(),
          employees: [],
          warehouse: [],
          category: [],
          products: [],
          promotions: [],
          orders: [],
          vouchers: [],
        },
      };

      const mockStore: StoreEntity = {
        id: '0466c77e-6314-4c51-8664-9a4b159237b8',
        name: 'store 1',
        typeStore: '1',
        address: 'asaa',
        user: null, // Nếu không có user, có thể để null
        employees: [], // Mảng rỗng cho employees nếu không có
        warehouse: [], // Mảng rỗng cho warehouse nếu không có
        category: [], // Mảng rỗng cho category nếu không có
        products: [], // Mảng rỗng cho products nếu không có
        promotions: [], // Mảng rỗng cho promotions nếu không có
        orders: [], // Mảng rỗng cho orders nếu không có
        vouchers: [], // Mảng rỗng cho vouchers nếu không có
      } as StoreEntity;

      const currentAdmin: TypeCurrent = {
        idAdmin: '167f13c4-e46c-47e7-aeac-6089b76c3e86',
        idUser: '9e986ad5-a098-441d-badc-e92703bf4301',
        idStore: mockStore,
        roles: Roles.ADMIN,
      };

      // Giả lập rằng email đã tồn tại
      mockUserRepository.findOne.mockResolvedValue(createUserStoreDto.user);

      await expect(
        usersService.createModerator(createUserStoreDto, currentAdmin),
      ).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserStoreDto.user.email },
      });
    });

    it('should throw BadRequestException if store name contains special characters', async () => {
      const createUserStoreDto: CreateUserStoreDto = {
        user: {
          email: 'moderator@example.com',
          password: 'strongpassword',
          createdAt: new Date() as unknown as Timestamp, // Thêm ngày tạo
          updatedAt: new Date() as unknown as Timestamp, // Thêm ngày cập nhật
          roles: Roles.ADMIN,
          id: '',
          storeId: '',
          status: Status.ACTIVE,
          store: new StoreEntity(),
          emailVerificationToken: '',
          admin: new AdminEntity(),
        },
        store: {
          name: 'Test Store',
          typeStore: 'Retail',
          address: '123 Test St',
          id: '0466c77e-6314-4c51-8664-9a4b159237b8',
          user: new UserEntity(),
          employees: [],
          warehouse: [],
          category: [],
          products: [],
          promotions: [],
          orders: [],
          vouchers: [],
        },
      };

      const mockStore: StoreEntity = {
        id: '0466c77e-6314-4c51-8664-9a4b159237b8',
        name: 'store 1',
        typeStore: '1',
        address: 'asaa',
        user: null, // Nếu không có user, có thể để null
        employees: [], // Mảng rỗng cho employees nếu không có
        warehouse: [], // Mảng rỗng cho warehouse nếu không có
        category: [], // Mảng rỗng cho category nếu không có
        products: [], // Mảng rỗng cho products nếu không có
        promotions: [], // Mảng rỗng cho promotions nếu không có
        orders: [], // Mảng rỗng cho orders nếu không có
        vouchers: [], // Mảng rỗng cho vouchers nếu không có
      } as StoreEntity;

      const currentAdmin: TypeCurrent = {
        idAdmin: '167f13c4-e46c-47e7-aeac-6089b76c3e86',
        idUser: '9e986ad5-a098-441d-badc-e92703bf4301',
        idStore: mockStore,
        roles: Roles.ADMIN,
      };

      await expect(
        usersService.createModerator(createUserStoreDto, currentAdmin),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
