import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { checkText } from 'src/utils/common/CheckText';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeesRepository: Repository<EmployeeEntity>,
    private readonly userService: UsersService,
  ) {}

  async createStaff(
    createEmployeeDto: CreateEmployeeDto,
    currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    const phoneExists = await this.employeesRepository.find({
      where: {
        phone: createEmployeeDto.phone,
        store: { id: currentStore.id },
      },
    });
    if (!phoneExists) throw new BadRequestException('Phone number was exists');
    if (
      checkText(createEmployeeDto.firstName) ||
      checkText(createEmployeeDto.lastName)
    ) {
      throw new BadRequestException('The name contains special characters');
    }
    const staff = await this.addEmployees(
      Roles.STAFF,
      createEmployeeDto,
      currentStore,
    );
    return staff;
  }

  async createCustomer(
    createEmployeeDto: CreateEmployeeDto,
    currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    const phoneExists = await this.employeesRepository.find({
      where: {
        phone: createEmployeeDto.phone,
        store: { id: currentStore.id },
      },
    });
    if (!phoneExists) throw new BadRequestException('Phone number was exists');
    if (
      checkText(createEmployeeDto.firstName) ||
      checkText(createEmployeeDto.lastName)
    ) {
      throw new BadRequestException('The name contains special characters');
    }
    const customer = await this.addEmployees(
      Roles.CUSTOMER,
      createEmployeeDto,
      currentStore,
    );
    return customer;
  }

  async findAllStaff(currentStore: StoreEntity): Promise<EmployeeEntity[]> {
    const staff = await this.employeesRepository.find({
      where: { roles: Roles.STAFF, store: { id: currentStore.id } },
    });
    return staff;
  }

  async findAllStaffPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.employeesRepository.findAndCount({
      where: { roles: Roles.STAFF, store: { id: currentStore.id } },
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

  async findAllCustomerPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.employeesRepository.findAndCount({
      where: { store: { id: currentStore.id }, roles: Roles.CUSTOMER },
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

  async findAllCustomer(currentStore: StoreEntity): Promise<EmployeeEntity[]> {
    const customer = await this.employeesRepository.find({
      where: { store: { id: currentStore.id } },
    });
    return customer;
  }

  async findOneStaff(id: string, currentStore: StoreEntity): Promise<any> {
    const staff = await this.employeesRepository.findOne({
      where: { roles: Roles.STAFF, id: id, store: { id: currentStore.id } },
      relations: { store: true },
    });

    if (!staff) throw new BadRequestException('Staff not found!!');
    return staff;
  }

  async findOneCustomer(
    id: string,
    currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    const customer = await this.employeesRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
    });
    if (!customer) throw new BadRequestException('Customer not found!!');
    return customer;
  }

  async updateStaff(
    id: string,
    fields: Partial<UpdateEmployeeDto>,
    currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    const staff = await this.findOneStaff(id, currentStore);
    if (!staff) throw new BadRequestException('Staff not found!!');
    const salary =
      fields.salary !== undefined
        ? parseFloat(fields.salary.toString())
        : undefined;
    if (salary !== undefined && (isNaN(salary) || salary > 99999999.999)) {
      throw new BadRequestException('Salary value is out of range');
    }

    Object.assign(staff, fields);

    const result = await this.employeesRepository.save(staff);
    return result;
  }

  async updateCustomer(
    id: string,
    fields: Partial<UpdateEmployeeDto>,
    currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    const customer = await this.findOneCustomer(id, currentStore);
    if (!customer) throw new BadRequestException('Customer not found!!');
    Object.assign(customer, fields);
    return await this.employeesRepository.save(customer);
  }

  async removeStaff(id: string) {
    const staff = await this.employeesRepository.findOneBy({ id });
    if (!staff) throw new BadRequestException('Staff not found!!');
    return await this.employeesRepository.delete(id);
  }

  async removeCustomer(id: string) {
    const customer = await this.employeesRepository.findOneBy({ id });
    if (!customer) throw new BadRequestException('Customer not found!!');
    return await this.employeesRepository.delete(id);
  }

  async addEmployees(
    role: Roles,
    data: CreateEmployeeDto,
    currentStore: StoreEntity,
  ) {
    if (
      (data.salary === 0 || data.salary < 0 || !data.salary) &&
      role === Roles.STAFF
    )
      throw new BadRequestException(
        'You must fill salary > 0 and salary should be empty',
      );
    if (data.salary && role === Roles.CUSTOMER) {
      throw new BadRequestException('Customer have not salary');
    }
    let employee = await this.employeesRepository.create(data);
    if (role === Roles.CUSTOMER) {
      employee.salary = 0;
    }
    employee.roles = role;
    employee.store = currentStore;
    employee = await this.employeesRepository.save(employee);
    return employee;
  }

  async updatePoint(point: number, id: string) {
    const employee = await this.employeesRepository.findOneBy({ id: id });
    if (!employee) throw new BadRequestException('Employee not found!!');
    employee.point = Number(employee.point) + point;
    employee.quantityOrder += 1;
    return await this.employeesRepository.save(employee);
  }
}
