import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateStoreStatus } from 'src/store/dto/update-status-store.dto';
import { StoreEntity } from 'src/store/entities/store.entity';
import { CurrentUser } from 'src/utils/decoratores/current-user.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { Status } from 'src/utils/enums/user-status.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { SignInDto } from './dto/signin.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CurrentStore } from 'src/utils/decoratores/current-store.decoratore';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() adminCreateDto: CreateAdminDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(adminCreateDto) };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: SignInDto) {
    const user = await this.usersService.signin(userSignInDto);
    if (user.status !== Status.ACTIVE) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Tài khoản của bạn chưa được kích hoạt.',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const accessToken = await this.usersService.accessToken(user);
    const type = process.env.ACCESS_TOKEN_TYPE;
    const time = process.env.ACCESS_TOKEN_EXPIRE_TIME;
    return {
      data: { accessToken, user, type, time },
    };
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    const isValid = await this.usersService.verifyEmailToken(token);

    if (isValid) {
      return { message: 'Email verified successfully.' };
    } else {
      return { message: 'Invalid or expired token.' };
    }
  }

  // @UseGuards(AuthenticationGuard)
  // @Get('profile')
  // async profile(@CurrentUser() currentAdmin: UserEntity) {
  //   const profile = await this.usersService.profile(currentAdmin);

  //   return profile;
  // }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('moderator')
  async createModerator(
    @Body() createModerator: CreateModeratorDto,
    @CurrentUser() currentAdmin: UserEntity,
  ) {
    return await this.usersService.createModerator(
      createModerator,
      currentAdmin,
    );
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('moderator')
  async getAllStore(@CurrentUser() currentAdmin: UserEntity) {
    return await this.usersService.getAllStore(currentAdmin);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put('moderator/:id')
  async updateStatusStore(
    @Param('id') id: string,
    @Body() updateStoreStatus: UpdateStoreStatus,
    @CurrentUser() currentAdmin: UserEntity,
  ) {
    return await this.usersService.updateStatusStore(
      id,
      updateStoreStatus.status,
      currentAdmin,
    );
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('moderator/paginate')
  async getStorePaginate(
    @CurrentUser() currentAdmin: UserEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.getStorePaginate(currentAdmin, page, limit);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete('store/:id')
  async removeStoreUser(
    @Param('id') id: string,
    @CurrentUser() currentAdmin: UserEntity,
  ) {
    return await this.usersService.removeStoreUser(id, currentAdmin);
  }

  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN, Roles.MODERATOR]),
  )
  @Get('store/:id')
  async getInforByIdStore(@Param('id') id: string) {
    return await this.usersService.getInforByIdStore(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Post('store/staff')
  async createStaff(
    @Body() createStaff: CreateStaffDto,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.usersService.createStaffByStore(
      createStaff,
      currentStore,
    );
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Delete('store/staff')
  async removeStaff(
    @Query('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
  ) {
    return await this.usersService.removeStaff(id, currentStore);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Patch('store/staff/:id')
  async updateStaff(
    @Query('id') id: string,
    @CurrentStore() currentStore: StoreEntity,
    @Body() updateStaff: UpdateStaffDto,
  ) {
    return await this.usersService.updateStaff(currentStore, id, updateStaff);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Get('store/staff/all')
  async getAllStaff(@CurrentStore() currentStore: StoreEntity) {
    return await this.usersService.getAllStaff(currentStore);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Get('store/staff/:id')
  async getStaffById(
    @CurrentStore() currentStore: StoreEntity,
    @Query('id') id: string,
  ) {
    return await this.usersService.getStaffById(id, currentStore);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.MODERATOR]))
  @Get('store/staff/paginate')
  async getStaffPaginate(
    @CurrentStore() currentStore: StoreEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    console.log('getStaffPaginate');
    return await this.usersService.getStaffPaginate(page, limit, currentStore);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.usersService.findOne(id);
  // }
}
