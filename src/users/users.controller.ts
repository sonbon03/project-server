import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/utils/decoratores/current-user.decoratore';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { AdminDto } from './dto/admin.dto';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { EmailDto, SignInDto } from './dto/signin.dto';
import { AdminEntity } from './entities/admin.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { Status } from 'src/utils/enums/user-status.enum';
import { UpdateStoreStatus } from './dto/update.store.dto';
import { TypeCurrent } from 'src/utils/middlewares/current-user.middleware';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() adminCreateDto: AdminDto,
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
    return {
      data: { accessToken, user, type },
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

  @Get('verify/test')
  async verifyEmailTest(@Query('token') token: EmailDto) {
    const isValid = await this.usersService.test(token);

    console.log(isValid);
    return isValid;
  }
  // @UseGuards(AuthenticationGuard)
  // @Get('profile')
  // async profile(@CurrentUser() currentAdmin: AdminEntity) {
  //   const profile = await this.usersService.profile(currentAdmin);

  //   return profile;
  // }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('moderator')
  async createModerator(
    @Body() createUserStoreDto: CreateUserStoreDto,
    @CurrentUser() currentAdmin: AdminEntity,
  ) {
    return await this.usersService.createModerator(
      createUserStoreDto,
      currentAdmin,
    );
  }

  @Get('moderator')
  async getAllModerator(@CurrentUser() currentAdmin: TypeCurrent) {
    return await this.usersService.getAllModerator(currentAdmin);
  }

  @Put('moderator/:id')
  async updateStatusStore(
    @Param('id') id: string,
    @Body() updateStatusStore: UpdateStoreStatus,
    @CurrentUser() currentAdmin: TypeCurrent,
  ) {
    return await this.usersService.updateStatusStore(
      id,
      updateStatusStore,
      currentAdmin,
    );
  }

  @Get('moderator/paginate')
  async getModeratorPaginate(
    @CurrentUser() currentAdmin: TypeCurrent,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.getModeratorPaginate(
      currentAdmin,
      page,
      limit,
    );
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  // @Post('staff')
  // async createStaff(
  //   @Body() createStaff: UserDto,
  //   @CurrentStore() currentStore: StoreEntity,
  // ): Promise<UserEntity> {
  //   return await this.usersService.createStaff(createStaff, currentStore);
  // }

  // @Get('staff')
  // async getAllStaff(
  //   @CurrentStore() currentStore: StoreEntity,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ): Promise<{
  //   data: UserEntity[];
  //   currentPage: number;
  //   totalPages: number;
  //   totalItems: number;
  // }> {
  //   return await this.usersService.getAllStaff(currentStore, page, limit);
  // }

  @Get('paginate')
  async findStorePaginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.findStorePaginate(page, limit);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.SUPERADMIN, Roles.ADMIN]),
  )
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SUPERADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any[]> {
    return await this.usersService.remove(id);
  }
}
