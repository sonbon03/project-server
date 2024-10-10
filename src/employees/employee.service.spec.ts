import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { StoreEntity } from '../users/entities/store.entity';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Roles } from '../utils/enums/user-roles.enum';
import { UsersService } from '../users/users.service';
import { checkText } from '../utils/common/CheckText';
import { Gender } from '../utils/enums/user-gender.enum';

jest.mock('../utils/common/CheckText', () => ({
  checkText: jest.fn(),
}));

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeesRepository: Repository<EmployeeEntity>;

  const mockEmployeesRepository = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(EmployeeEntity),
          useValue: mockEmployeesRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    employeesRepository = module.get<Repository<EmployeeEntity>>(
      getRepositoryToken(EmployeeEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStaff', () => {
    it('should create a staff successfully', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'John',
        lastName: 'Doe',
        salary: 50000,
        birthday: new Date(),
        gender: Gender.MALE,
        role: Roles.STAFF,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      jest.spyOn(employeesRepository, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(service, 'addEmployees')
        .mockResolvedValueOnce(new EmployeeEntity());

      const result = await service.createStaff(createEmployeeDto, currentStore);

      expect(result).toBeInstanceOf(EmployeeEntity);
      expect(employeesRepository.find).toHaveBeenCalledWith({
        where: {
          phone: createEmployeeDto.phone,
          store: { id: currentStore.id },
        },
      });
      expect(service.addEmployees).toHaveBeenCalledWith(
        Roles.STAFF,
        createEmployeeDto,
        currentStore,
      );
    });

    it('should throw BadRequestException if phone already exists', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'John',
        lastName: 'Doe',
        salary: 50000,
        birthday: new Date(),
        gender: Gender.MALE,
        role: Roles.STAFF,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      const existingEmployee = new EmployeeEntity();
      existingEmployee.firstName = 'Existing';
      existingEmployee.lastName = 'Employee';
      existingEmployee.phone = '123456789';
      existingEmployee.salary = 50000;
      existingEmployee.birthday = new Date();

      jest
        .spyOn(employeesRepository, 'find')
        .mockResolvedValueOnce([existingEmployee]);

      await expect(
        service.createStaff(createEmployeeDto, currentStore),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if name contains special characters', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'John@',
        lastName: 'Doe',
        salary: 50000,
        birthday: new Date(),
        gender: Gender.MALE,
        role: Roles.STAFF,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      (checkText as jest.Mock).mockReturnValueOnce(true); // Simulate special character check

      await expect(
        service.createStaff(createEmployeeDto, currentStore),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'Jane',
        lastName: 'Doe',
        salary: 0,
        birthday: new Date(),
        gender: Gender.FEMALE,
        role: Roles.CUSTOMER,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      jest.spyOn(employeesRepository, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(service, 'addEmployees')
        .mockResolvedValueOnce(new EmployeeEntity());

      const result = await service.createCustomer(
        createEmployeeDto,
        currentStore,
      );

      expect(result).toBeInstanceOf(EmployeeEntity);
      expect(employeesRepository.find).toHaveBeenCalledWith({
        where: {
          phone: createEmployeeDto.phone,
          store: { id: currentStore.id },
        },
      });
      expect(service.addEmployees).toHaveBeenCalledWith(
        Roles.CUSTOMER,
        createEmployeeDto,
        currentStore,
      );
    });

    it('should throw BadRequestException if phone already exists', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'Jane',
        lastName: 'Doe',
        salary: 0,
        birthday: new Date(),
        gender: Gender.FEMALE,
        role: Roles.CUSTOMER,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      const existingEmployee = new EmployeeEntity();
      existingEmployee.firstName = 'Existing';
      existingEmployee.lastName = 'Employee';
      existingEmployee.phone = '123456789';
      existingEmployee.salary = 50000;
      existingEmployee.birthday = new Date();

      jest
        .spyOn(employeesRepository, 'find')
        .mockResolvedValueOnce([existingEmployee]);

      await expect(
        service.createCustomer(createEmployeeDto, currentStore),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if name contains special characters', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        phone: '123456789',
        firstName: 'Jane@',
        lastName: 'Doe',
        salary: 0,
        birthday: new Date(),
        gender: Gender.FEMALE,
        role: Roles.CUSTOMER,
      };
      const currentStore = new StoreEntity();
      currentStore.id = '0466c77e-6314-4c51-8664-9a4b159237b8';

      (checkText as jest.Mock).mockReturnValueOnce(true); // Simulate special character check

      await expect(
        service.createCustomer(createEmployeeDto, currentStore),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
