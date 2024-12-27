import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidatePromise } from 'class-validator';
import { CreateStoreDto } from 'src/store/dto/create-store.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './signin.dto';
import { Status } from 'src/utils/enums/user-status.enum';

export class CreateModeratorDto extends SignInDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Salary not empty' })
  salary: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Store not empty' })
  status: Status;

  @ApiProperty({ type: CreateUserDto })
  @Type(() => CreateUserDto)
  @ValidatePromise()
  user: CreateUserDto;

  @ApiProperty({ type: CreateStoreDto })
  @Type(() => CreateStoreDto)
  @ValidatePromise()
  store: CreateStoreDto;
}
