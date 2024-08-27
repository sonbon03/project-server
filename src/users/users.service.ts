import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { SignInDto } from './dto/signin.dto';
import { StoreEntity } from './entities/store.entity';
import { UserEntity } from './entities/user.entity';
import { Roles } from 'src/utils/enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
  ) {}

  async signup(userCreateStore: CreateUserStoreDto): Promise<any> {
    const userExists = await this.findUserByEmail(userCreateStore.user.email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    let store = await this.storesRepository.create(userCreateStore.store);
    store = await this.storesRepository.save(store);
    userCreateStore.user.password = await hash(
      userCreateStore.user.password,
      10,
    );
    let user = await this.usersRepository.create(userCreateStore.user);
    user.storeId = store.id;
    user.store = store;
    user = await this.usersRepository.save(user);
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

    if (!userExists) throw new BadRequestException('User not exists');

    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Password is not true!');
    }

    delete userExists.password;
    return userExists;
  }

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
          status: true,
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
          status: true,
        },
      },
    });
    if (!user) throw new NotFoundException('Store user is not found!');
    return user;
  }

  async findOneStore(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User is not found!');
    const store = await this.storesRepository.findOne({
      where: { id: user.storeId },
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
    return await this.usersRepository.findOneBy({ email: email });
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
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }
}
