import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';
import { CreateCustomerDto } from 'src/store/dto/create-customer.dto';
import { StoreEntity } from 'src/store/entities/store.entity';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StoreService } from '../store/store.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { SignInDto } from './dto/signin.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UserStoreEntity } from './entities/user-store.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserStoreEntity)
    private readonly userStoreRepository: Repository<UserStoreEntity>,
    @Inject(forwardRef(() => StoreService))
    private readonly storeService: StoreService,
    private readonly mailService: MailService,
  ) {}

  async signup(userCreateDto: CreateAdminDto): Promise<any> {
    const userExists = await this.usersRepository.find({
      where: { email: userCreateDto.email, roles: Roles.ADMIN },
    });
    if (userExists && userExists.length > 0) {
      throw new BadRequestException('Email already exists');
    }
    let user = await this.usersRepository.create(userCreateDto);
    user.password = await hash(userCreateDto.password, 10);
    user.status = Status.PENDING;
    user.roles = Roles.ADMIN;
    const emailVerificationToken = uuidv4();
    user.emailVerificationToken = emailVerificationToken;

    user = await this.usersRepository.save(user);

    // await this.mailService.sendVerificationEmail(
    //   user.email,
    //   emailVerificationToken,
    // );

    // try {

    // } catch (error) {

    // }

    delete user.password;
    return await user;
  }

  async signin(userSignInDto: SignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
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

    delete userExists.password;
    return userExists;
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

  async verifyEmailToken(token: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user || !user.emailVerificationToken) {
      return false;
    }

    user.status = Status.ACTIVE;
    user.emailVerificationToken = null; // Xóa token sau khi xác thực
    await this.usersRepository.save(user);

    return true;
  }

  async findOneAdmin(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id, roles: Roles.ADMIN },
    });

    if (!user) throw new NotFoundException('User is not found!');

    return user;
  }

  async findOneStoreUser(id: string) {
    const user = await this.userStoreRepository.findOne({
      where: { userId: id },
      relations: {
        user: true,
      },
    });

    if (!user) throw new NotFoundException('User is not found!');
    const store = await this.storeService.findStore(user.storeId);
    const result = { ...store, roles: user.user.roles };

    return result;
  }

  async findOne(storeId: string) {
    const user = await this.userStoreRepository.findOne({
      where: { storeId: storeId },
      relations: { user: true, store: true },
    });
    if (!user) throw new NotFoundException('Store user is not found!');
    return user;
  }

  async createUser(user: CreateCustomerDto, currentStore: StoreEntity) {
    const checkPhone = await this.userStoreRepository.find({
      where: {
        storeId: currentStore.id,
        user: {
          phone: user.phone,
          roles: Roles.CUSTOMER,
        },
      },
    });
    if (checkPhone.length > 0) {
      throw new Error('Phone number already exists');
    }

    const customer = {
      ...user,
      roles: Roles.CUSTOMER,
      status: null,
    };
    return await this.usersRepository.save(customer);
  }

  async updateUser(user: UserEntity) {
    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) {
      throw new Error('User is not found!');
    }
    return await this.usersRepository.save(user);
  }

  async createModerator(
    createModerator: CreateModeratorDto,
    currentAdmin: UserEntity,
  ) {
    const findEmail = await this.usersRepository.findOne({
      where: { email: createModerator.email },
    });
    if (findEmail) throw new BadRequestException('Email was exists');

    const userModerator = {
      ...createModerator.user,
      status: createModerator.status,
      roles: Roles.MODERATOR,
      email: createModerator.email,
      password: await hash(createModerator.password, 10),
    };

    try {
      const user = await this.usersRepository.save(userModerator);
      const store = await this.storeService.createStore(createModerator.store);

      const userStore = {
        userId: user.id,
        storeId: store.id,
        adminId: currentAdmin.id,
      };

      return await this.userStoreRepository.save(userStore);
    } catch (error) {
      throw new Error('Can not add');
    }
  }

  async updateStatusStore(
    storeId: string,
    status: Status,
    currentAdmin: UserEntity,
  ) {
    const store = await this.userStoreRepository.findOne({
      where: {
        storeId: storeId,
        adminId: currentAdmin.id,
      },
      relations: {
        user: true,
      },
    });
    if (!store) throw new NotFoundException('Store not found');
    store.user.status = status;
    return await this.userStoreRepository.save(store);
  }

  async getAllStore(currentAdmin: UserEntity): Promise<any> {
    const stores = await this.userStoreRepository.find({
      where: { adminId: currentAdmin.id },
      relations: {
        store: true,
        user: true,
      },
      order: { createdAt: 'DESC' },
    });
    if (!stores) throw new BadRequestException('Store not found!');

    const result = stores.map((item) => ({
      store: item.store,
      user: item.user,
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return result;
  }

  async getStorePaginate(
    currentAdmin: UserEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const [result, total] = await this.userStoreRepository.findAndCount({
      where: { adminId: currentAdmin.id },
      relations: {
        store: true,
        user: true,
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

  async getInforByIdStore(storeId: string) {
    const store = await this.userStoreRepository.findOne({
      where: { storeId: storeId },
      relations: {
        user: true,
        store: true,
      },
    });
    if (!store) throw new BadRequestException('Store not found!');
    return store;
  }

  async removeStoreUser(id: string, currentAdmin: UserEntity) {
    const findStore = await this.userStoreRepository.findOne({
      where: { storeId: id, adminId: currentAdmin.id },
    });

    if (!findStore) throw new BadRequestException('Store not found!');
    return await this.userStoreRepository.delete({ storeId: id });
  }

  async createStaffByStore(
    createStaff: CreateStaffDto,
    currentStore: StoreEntity,
  ) {
    const checkPhone = await this.userStoreRepository.find({
      where: {
        storeId: currentStore.id,
        user: {
          phone: createStaff.phone,
          roles: Roles.STAFF,
        },
      },
    });
    if (checkPhone.length > 0) {
      throw new BadRequestException('Phone number already exists');
    }
    const staff = {
      ...createStaff,
      roles: Roles.STAFF,
      status: null,
    };

    const result = await this.usersRepository.save(staff);

    return await this.createStaff(currentStore.id, result.id);
  }

  async createStaff(storeId: string, userId: string) {
    const userStore = await this.userStoreRepository.save({
      storeId: storeId,
      userId: userId,
    });

    return await this.userStoreRepository.findOne({
      where: {
        storeId: userStore.storeId,
        userId: userStore.userId,
      },
      relations: {
        store: true,
        user: true,
      },
    });
  }

  async removeStaff(id: string, currentStore: StoreEntity) {
    const staff = await this.userStoreRepository.findOne({
      where: {
        userId: id,
        storeId: currentStore.id,
      },
    });
    if (!staff) {
      throw new Error('Staff not found');
    }
    await this.userStoreRepository.delete(staff.id);
    return [];
  }

  async getAllStaff(currentStore: StoreEntity) {
    return await this.userStoreRepository.find({
      where: {
        storeId: currentStore.id,
      },
      relations: {
        store: true,
        user: true,
      },
    });
  }

  async getStaffById(staffId: string, currentStore: StoreEntity) {
    const staff = await this.userStoreRepository.find({
      where: {
        userId: staffId,
        storeId: currentStore.id,
      },
      relations: {
        store: true,
        user: true,
      },
    });
    if (!staff) {
      throw new Error('Staff not found');
    }
    return staff;
  }

  async getStaffPaginate(
    page: number = 1,
    limit: number = 10,
    currentStore: StoreEntity,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const [result, total] = await this.userStoreRepository.findAndCount({
      where: {
        storeId: currentStore.id,
        user: {
          roles: Roles.STAFF,
        },
      },
      relations: {
        user: true,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async updateStaff(
    currentStore: StoreEntity,
    id: string,
    fields: Partial<UpdateStaffDto>,
  ) {
    const staff = await this.userStoreRepository.findOne({
      where: { storeId: currentStore.id, user: { id } },
    });
    if (!staff) throw new BadRequestException('Staff not exists');
    Object.assign(staff.user, fields);
    return await this.updateUser(staff.user);
  }

  async getStore(idStore: string, currentUser: UserEntity): Promise<any> {
    const store = await this.userStoreRepository.findOneBy({
      storeId: idStore,
      userId: currentUser.id,
    });
    if (!store) throw new BadRequestException('Store not found!');
    return store;
  }

  async checkStore(idStore: string): Promise<any> {
    const store = await this.userStoreRepository.findOneBy({
      storeId: idStore,
    });
    if (!store) throw new BadRequestException('Store not found!');
    return store;
  }

  // async profile(currentAdmin: UserEntity) {

  // }

  // async getModeratorPaginate(
  //   currentAdmin: UserEntity,
  //   page: number = 1,
  //   limit: number = 10,
  // ) {
  //   const skip = (page - 1) * limit;
  //   const take = limit;

  //   const [userStores, total] = await this.userStoreRepository.findAndCount({
  //     where: {
  //       user: {
  //         adminId: currentAdmin.id,
  //         roles: Roles.MODERATOR,
  //       },
  //     },
  //     relations: {
  //       store: true,
  //       user: true,
  //     },
  //     skip,
  //     take,
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });
  //   const totalPages = Math.ceil(total / limit);

  //   const result = userStores.reduce((acc, userStore) => {
  //     const { user, store } = userStore;

  //     if (user) {
  //       delete user.password;
  //     }

  //     let existingUser = acc.find((item) => item.user.id === user.id);

  //     if (!existingUser) {
  //       existingUser = { user, store: [] };
  //       acc.push(existingUser);
  //     }

  //     existingUser.store.push(store);

  //     return acc;
  //   }, []);

  //   return {
  //     items: result,
  //     currentPage: Number(page),
  //     totalPages: totalPages,
  //     totalItems: total,
  //   };
  // }
}
