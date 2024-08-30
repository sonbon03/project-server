import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserStoreDto } from './dto/create-store-user.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/enums/user-roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() userCreateStoreUser: CreateUserStoreDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userCreateStoreUser) };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: SignInDto) {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
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

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SUPERADMIN]))
  @Get('paginate')
  async findStorePaginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.findStorePaginate(page, limit);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SUPERADMIN]))
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SUPERADMIN]))
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
