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
import { checkText } from 'src/utils/common/CheckText';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { SignInDto } from './dto/signin.dto';
import { UpdateStoreStatus } from './dto/update.store.dto';
import { StoreEntity } from './entities/store.entity';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
    private readonly mailService: MailService,
  ) {}

  async signup(userCreateDto: CreateUserDto): Promise<any> {
    const userExists = await this.findUserByEmail(userCreateDto.email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    userCreateDto.password = await hash(userCreateDto.password, 10);

    const createAdmin = {
      phone: userCreateDto.phone,
      name: userCreateDto.name,
    };

    const admin = await this.usersRepository.create(createAdmin);
    await this.usersRepository.save(admin);

    const createUser = {
      email: userCreateDto.email,
      password: userCreateDto.password,
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

    delete userExists.password;

    return userExists;
  }

  // async profile(currentAdmin: UserEntity) {

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
      where: { id: id, roles: Roles.ADMIN },
    });

    if (!user) throw new NotFoundException('User is not found!');

    return user;
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

  async createModerator(
    createUserStore: CreateUserStoreDto,
    currentAdmin: UserEntity,
  ) {
    if (checkText(createUserStore.user.name)) {
      throw new BadRequestException(
        'The category name contains special characters',
      );
    }
    const findEmail = await this.usersRepository.findOne({
      where: { email: createUserStore.user.email },
    });
    if (findEmail) throw new BadRequestException('Email was exists');

    const store = await this.storesRepository.create(createUserStore.store);
    store.user = currentAdmin;
    await this.storesRepository.save(store);
    let user = await this.usersRepository.create(createUserStore.user);
    user.password = await hash(user.password, 10);
    user.roles = Roles.MODERATOR;
    user.storeId = store.id;
    user = await this.usersRepository.save(user);
    return user;
  }

  async getAllModerator(currentAdmin: UserEntity) {
    const stores = await this.usersRepository.find({
      where: {
        store: {
          user: currentAdmin,
        },
        roles: Roles.MODERATOR,
      },
      relations: {
        store: true,
      },
    });
    return stores;
  }

  async getModeratorPaginate(
    currentAdmin: UserEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.usersRepository.findAndCount({
      where: {
        store: {
          user: currentAdmin,
        },
        roles: Roles.MODERATOR,
      },
      relations: {
        store: true,
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
    currentAdmin: UserEntity,
  ) {
    const store = await this.usersRepository.findOne({
      where: {
        id: id,
        store: {
          user: currentAdmin,
        },
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
