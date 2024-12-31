import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { StoreCustomerEntity } from './entities/store-customer.entity';
import { StoreEntity } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(StoreCustomerEntity)
    private readonly storeCustomerRepository: Repository<StoreCustomerEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createStore(createStore: CreateStoreDto) {
    try {
      return await this.storeRepository.save(createStore);
    } catch (error) {
      throw new BadRequestException('Can not add store');
    }
  }

  async createCustomer(
    currentStore: StoreEntity,
    createCustomer: CreateCustomerDto,
  ) {
    const user = await this.usersService.createUser(
      createCustomer,
      currentStore,
    );

    await this.storeCustomerRepository.save({
      storeId: currentStore.id,
      userId: user.id,
    });
  }

  async getAllCustomer(currentStore: StoreEntity) {
    const customers = await this.storeCustomerRepository.find({
      where: {
        storeId: currentStore.id,
        user: {
          roles: Roles.CUSTOMER,
        },
      },
    });
    const result = {
      store: currentStore,
      users: customers.map((customer) => ({
        quantityOrder: customer.quantityOrder,
        point: customer.point,
        user: customer.user,
      })),
    };
    return result;
  }

  async getCustomerPaginate(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const [result, total] = await this.storeCustomerRepository.findAndCount({
      where: { storeId: currentStore.id },
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

  async getInforCustomerByStore(currentStore: StoreEntity, id: string) {
    const customer = await this.storeCustomerRepository.findOne({
      where: {
        storeId: currentStore.id,
        user: { id },
      },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async removeCustomer(currentStore: StoreEntity, id: string) {
    const customer = await this.storeCustomerRepository.findOne({
      where: {
        storeId: currentStore.id,
        user: { id },
      },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return await this.storeCustomerRepository.delete(customer);
  }

  async updateCustomer(
    currentStore: StoreEntity,
    id: string,
    fields: Partial<UpdateCustomerDto>,
  ) {
    const customer = await this.storeCustomerRepository.findOne({
      where: { store: { id: currentStore.id }, user: { id } },
    });
    if (!customer) throw new BadRequestException('Customer not exists');
    Object.assign(customer.user, fields);
    return await this.usersService.updateUser(customer.user);
  }

  async updatePoint(point: number, id: string) {
    const employee = await this.storeCustomerRepository.findOneBy({ id: id });
    if (!employee) throw new BadRequestException('Employee not found!!');
    employee.point = Number(employee.point) + point;
    employee.quantityOrder += 1;
    return await this.storeCustomerRepository.save(employee);
  }

  async findOneCustomer(customerId: string, currentStore: StoreEntity) {
    const customer = await this.storeCustomerRepository.findOne({
      where: {
        storeId: currentStore.id,
        user: { id: customerId, roles: Roles.CUSTOMER },
      },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async findStore(storeId: string) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }
}
