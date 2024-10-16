import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AdminEntity } from './entities/admin.entity';
import { MailService } from '../mail/mail.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { AdminDto } from './dto/admin.dto';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<UserEntity>;
  let adminRepository: Repository<AdminEntity>;
  let mailService: MailService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockAdminRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(AdminEntity),
          useValue: mockAdminRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    adminRepository = module.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );
    mailService = module.get<MailService>(MailService);
  });

  describe('signup', () => {
    it('should successfully signup a new user', async () => {
      const adminDto: AdminDto = {
        email: 'son12@gmail.com',
        password: '12345',
        phone: '0123456789',
        name: 'Admin Name',
      };

      mockUsersRepository.findOne.mockResolvedValue(null); // No user exists
      mockAdminRepository.create.mockReturnValue({
        id: '167f13c4-e46c-47e7-aeac-6089b76c3e86',
      });
      mockAdminRepository.save.mockResolvedValue({
        id: '167f13c4-e46c-47e7-aeac-6089b76c3e86',
      });
      mockUsersRepository.create.mockReturnValue({ email: adminDto.email });
      mockUsersRepository.save.mockResolvedValue({
        id: '9e986ad5-a098-441d-badc-e92703bf4301',
        email: adminDto.email,
        password: adminDto.password,
        emailVerificationToken: uuidv4(),
      });
      mockMailService.sendVerificationEmail.mockResolvedValue(null);

      const result = await usersService.signup(adminDto);

      expect(result).toHaveProperty('email', adminDto.email);
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw an error if email already exists', async () => {
      const adminDto: AdminDto = {
        email: 'son@gmail.com',
        password: '12345',
        phone: '0123456789',
        name: 'Admin Name',
      };

      mockUsersRepository.findOne.mockResolvedValue({}); // User exists

      await expect(usersService.signup(adminDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signin', () => {
    it('should successfully signin a user', async () => {
      const signInDto: SignInDto = {
        email: 'tson2003@gmail.com',
        password: '12345',
      };

      mockUsersRepository.createQueryBuilder().getOne.mockResolvedValue({
        id: 'b2d83a2b-9539-4a0b-99a6-c1fd5257a148',
        email: signInDto.email,
        password: await hash(signInDto.password, 10), // Mock hashed password
        store: null,
      });
      mockAdminRepository.findOne.mockResolvedValue({ name: 'aaaa' });

      const result = await usersService.signin(signInDto);

      expect(result).toHaveProperty('email', signInDto.email);
    });

    it('should throw an error if user does not exist', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersRepository.createQueryBuilder().getOne.mockResolvedValue(null); // User does not exist

      await expect(usersService.signin(signInDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const signInDto: SignInDto = {
        email: 'son@gmail.com',
        password: 'asdasd',
      };

      mockUsersRepository.createQueryBuilder().getOne.mockResolvedValue({
        id: '9e986ad5-a098-441d-badc-e92703bf4301',
        email: signInDto.email,
        password: await hash('correctpassword', 10), // Mock hashed password
      });

      await expect(usersService.signin(signInDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
