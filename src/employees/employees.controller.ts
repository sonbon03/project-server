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
import { CurrentUser } from 'src/utils/decoratores/current-user.decoratore';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from '../utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { EmployeeEntity } from './entities/employee.entity';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { StoreEntity } from 'src/users/entities/store.entity';

@Controller('employees')
@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('staff')
  async createStaff(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<EmployeeEntity> {
    return this.employeesService.createStaff(createEmployeeDto, currentUser);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('customer')
  async createCustomer(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<EmployeeEntity> {
    return await this.employeesService.createCustomer(
      createEmployeeDto,
      currentUser,
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

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('staff')
  async findAllStaff(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity[]> {
    return await this.employeesService.findAllStaff(currentStore);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('customer')
  async findAllCustomer(
    @CurrentStore() currentStore: StoreEntity,
  ): Promise<EmployeeEntity[]> {
    return await this.employeesService.findAllCustomer(currentStore);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('staff/:id')
  async findOneStaff(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.employeesService.findOneStaff(id, currentStore);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('customer/:id')
  async findOneCustomer(
    @Param('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.employeesService.findOneCustomer(id, currentStore);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
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

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
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

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete('customer/:id')
  async removeCustomer(@Param('id') id: string) {
    return await this.employeesService.removeCustomer(id);
  }

  @Delete('staff/:id')
  async removeStaff(@Param('id') id: string) {
    return await this.employeesService.removeStaff(id);
  }
}
