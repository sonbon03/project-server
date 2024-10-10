import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthenticationGuard } from '../utils/guards/authentication.guard';
import { AuthorizeGuard } from '../utils/guards/authorization.guard';
import { Roles } from '../utils/enums/user-roles.enum';
import { EmployeeEntity } from './entities/employee.entity';
import { CurrentStore } from '../utils/decoratores/current-store.decoratore';
import { StoreEntity } from '../users/entities/store.entity';

@Controller('employees')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('staff')
  async createStaff(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    return this.employeesService.createStaff(createEmployeeDto, currentStore);
  }

  @Post('customer')
  async createCustomer(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    return await this.employeesService.createCustomer(
      createEmployeeDto,
      currentStore,
    );
  }

  @Get('staff/paginate')
  async findAllStaffPagination(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.employeesService.findAllStaffPagination(
      currentStore,
      page,
      limit,
    );
  }

  @Get('customer/paginate')
  async findAllCustomerPagination(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.employeesService.findAllCustomerPagination(
      currentStore,
      page,
      limit,
    );
  }

  @Get('staff')
  async findAllStaff(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity[]> {
    return await this.employeesService.findAllStaff(currentStore);
  }

  @Get('customer')
  async findAllCustomer(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity[]> {
    return await this.employeesService.findAllCustomer(currentStore);
  }

  @Get('staff/:id')
  async findOneStaff(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.employeesService.findOneStaff(id, currentStore);
  }

  @Get('customer/:id')
  async findOneCustomer(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.employeesService.findOneCustomer(id, currentStore);
  }

  @Patch('customer/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    return await this.employeesService.updateCustomer(
      id,
      updateEmployeeDto,
      currentStore,
    );
  }

  @Patch('staff/:id')
  async updateStaff(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity> {
    return await this.employeesService.updateStaff(
      id,
      updateEmployeeDto,
      currentStore,
    );
  }

  @Delete('customer/:id')
  async removeCustomer(@Param('id') id: string) {
    return await this.employeesService.removeCustomer(id);
  }

  @Delete('staff/:id')
  async removeStaff(@Param('id') id: string) {
    return await this.employeesService.removeStaff(id);
  }
}
