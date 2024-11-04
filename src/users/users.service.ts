import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
import { TypeCurrent } from 'src/utils/middlewares/current-user.middleware';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminDto } from './dto/admin.dto';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { SignInDto } from './dto/signin.dto';
import { AdminEntity } from './entities/admin.entity';
import { StoreEntity } from './entities/store.entity';
import { UserEntity } from './entities/user.entity';
import { UpdateStoreStatus } from './dto/update.store.dto';
import { checkText } from 'src/utils/common/CheckText';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly mailService: MailService,
  ) {}

  async signup(adminCreateDto: AdminDto): Promise<any> {
    const userExists = await this.findUserByEmail(adminCreateDto.email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    adminCreateDto.password = await hash(adminCreateDto.password, 10);

    const createAdmin = {
      phone: adminCreateDto.phone,
      name: adminCreateDto.name,
    };

    const admin = await this.adminRepository.create(createAdmin);
    await this.adminRepository.save(admin);

    const createUser = {
      email: adminCreateDto.email,
      password: adminCreateDto.password,
      admin,
    };
    let user = await this.usersRepository.create(createUser);
    const emailVerificationToken = uuidv4();
    user.emailVerificationToken = emailVerificationToken;

    user = await this.usersRepository.save(user);

    await this.mailService.sendVerificationEmail(
      user.email,
      emailVerificationToken,
    );

    delete user.password;
    return await user;
  }

  async signin(userSignInDto: SignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .leftJoinAndSelect('users.store', 'stores')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new HttpException('User not exists', 422);

    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );
    if (!matchPassword) {
      throw new HttpException('Password is not true!', 422);
    }

    const adminExists = await this.adminRepository.findOne({
      where: { users: { id: userExists.id } },
    });
    delete userExists.password;
    const user = {
      ...userExists,
      name: !userExists.store
        ? (adminExists?.name ?? '')
        : userExists.store.name,
    };
    return user;
  }

  // async profile(currentAdmin: AdminEntity) {

  // }

  async findStorePaginate(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.usersRepository.findAndCount({
      where: { roles: Roles.ADMIN },
      relations: {
        store: true,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findAll() {
    const user = await this.usersRepository.find({
      relations: {
        store: true,
      },
      select: {
        store: {
          id: true,
          name: true,
          typeStore: true,
          address: true,
        },
      },
    });
    if (!user) throw new BadRequestException('Store user not found');
    return user;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { store: true },
      select: {
        store: {
          id: true,
          name: true,
          typeStore: true,
          address: true,
        },
      },
    });
    if (!user) throw new NotFoundException('Store user is not found!');
    return user;
  }

  async findOneAdmin(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User is not found!');
    const admin = await this.adminRepository.findOne({
      where: { id: user.admin?.id },
      relations: {
        users: true,
      },
    });
    if (!admin) throw new NotFoundException('Admin is not found!');

    const data: TypeCurrent = {
      idAdmin: admin.id,
      idUser: user.id,
      idStore: user.store,
      roles: user.roles,
    };

    return data;
  }

  async findOneStore(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User is not found!');
    const store = await this.storesRepository.findOne({
      where: { id: user?.storeId },
    });
    if (!store) throw new NotFoundException('Store is not found!');

    return store;
  }

  async remove(id: string): Promise<any[]> {
    const findStore = await this.storesRepository.findOne({
      where: { id: id },
      relations: { user: true },
      select: {
        user: {
          id: true,
        },
      },
    });
    if (!findStore) throw new BadRequestException('Store not found!');
    const userId = findStore.user.id;
    await this.storesRepository.delete(id);
    await this.usersRepository.delete(userId);
    return [];
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({
      email: email,
    });
  }

  async getStore(idStore: string): Promise<any> {
    const store = await this.storesRepository.find({ where: { id: idStore } });
    if (!store) throw new BadRequestException('Store not found!');
    return store;
  }

  async accessToken(user: UserEntity) {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn:
          user.roles === Roles.MODERATOR
            ? process.env.ACCESS_TOKEN_MODERATOR_TIME
            : process.env.ACCESS_TOKEN_EXPIRE_TIME,
      },
    );
  }

  // async updateStatusStore(id: string, status: Status): Promise<StoreEntity> {
  //   const store = await this.storesRepository.findOne({
  //     where: { id: id },
  //   });
  //   console.log(store);
  //   if (!store) throw new NotFoundException('Store is not found!');
  //   if (store.status === Status.ACTIVE && status === Status.ACTIVE) {
  //     throw new BadRequestException('Store was acvite');
  //   }
  //   if (
  //     (store.status === Status.CANCEL || store.status === Status.PENDING) &&
  //     status === Status.ACTIVE
  //   ) {
  //     store.status = status;
  //     console.log(1);
  //   }

  //   return await this.storesRepository.save(store);
  // }

  async verifyEmailToken(token: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { emailVerificationToken: token },
      relations: {
        store: true,
      },
    });

    if (!user || !user.emailVerificationToken) {
      return false;
    }

    user.status = Status.ACTIVE;
    user.emailVerificationToken = null; // Xóa token sau khi xác thực
    await this.usersRepository.save(user);

    return true;
  }

  // async createStaff(
  //   user: UserDto,
  //   currentStore: StoreEntity,
  // ): Promise<UserEntity> {
  //   const findStaff = await this.usersRepository.findOneBy({
  //     email: user.email,
  //     store: { id: currentStore.id },
  //   });
  //   if (findStaff) throw new BadRequestException('Emaill was exists in store');
  //   user.password = await hash(user.password, 10);
  //   const staff = await this.usersRepository.create(user);
  //   staff.roles = Roles.STAFF;
  //   staff.store = currentStore;
  //   delete staff.password;
  //   return await this.usersRepository.save(staff);
  // }

  // async getAllStaff(
  //   currentStore: StoreEntity,
  //   page: number = 1,
  //   limit: number = 10,
  // ): Promise<{
  //   data: UserEntity[];
  //   currentPage: number;
  //   totalPages: number;
  //   totalItems: number;
  // }> {
  //   const skip = (page - 1) * limit;
  //   const take = limit;

  //   const [result, total] = await this.usersRepository.findAndCount({
  //     where: { store: { id: currentStore.id }, roles: Roles.STAFF },
  //     skip,
  //     take,
  //     order: { createdAt: 'DESC' },
  //     relations: {
  //       store: true,
  //     },
  //   });

  //   const totalPages = Math.ceil(total / limit);
  //   return {
  //     data: result,
  //     currentPage: Number(page),
  //     totalPages: totalPages,
  //     totalItems: total,
  //   };
  // }

  async createModerator(
    createUserStore: CreateUserStoreDto,
    currentAdmin: AdminEntity,
  ) {
    if (checkText(createUserStore.store.name)) {
      throw new BadRequestException(
        'The category name contains special characters',
      );
    }
    const findEmail = await this.usersRepository.findOne({
      where: { email: createUserStore.user.email },
    });
    if (findEmail) throw new BadRequestException('Email was exists');

    const store = await this.storesRepository.create(createUserStore.store);
    await this.storesRepository.save(store);
    let user = await this.usersRepository.create(createUserStore.user);
    user.password = await hash(user.password, 10);
    user.roles = Roles.MODERATOR;
    const admin = await this.adminRepository.findOne({
      where: { id: currentAdmin.id },
    });
    user.admin = admin;
    user.store = store;
    user.storeId = store.id;
    user = await this.usersRepository.save(user);
    return user;
  }

  async getAllModerator(currentAdmin: TypeCurrent) {
    console.log(currentAdmin);
    const stores = await this.usersRepository.find({
      where: {
        admin: {
          id: currentAdmin.idAdmin,
        },
        roles: Roles.MODERATOR,
      },
      relations: {
        store: true,
        admin: true,
      },
    });
    return stores;
  }

  async getModeratorPaginate(
    currentAdmin: TypeCurrent,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.usersRepository.findAndCount({
      where: {
        admin: {
          id: currentAdmin.idAdmin,
        },
        roles: Roles.MODERATOR,
      },
      relations: {
        store: true,
        admin: true,
      },
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async updateStatusStore(
    id: string,
    updateStoreStatus: UpdateStoreStatus,
    currentAdmin: TypeCurrent,
  ) {
    const store = await this.usersRepository.findOne({
      where: {
        id: id,
        admin: { id: currentAdmin.idAdmin },
      },
    });
    if (!store) {
      throw new Error('Store not found');
    }
    store.status = updateStoreStatus.status;
    const result = await this.usersRepository.save(store);
    return result;
  }
}
