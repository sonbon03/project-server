import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidatePromise } from 'class-validator';
import { CreateStoreDto } from 'src/store/dto/create-store.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Status } from 'src/utils/enums/user-status.enum';
import { SignInDto } from './signin.dto';

export class CreateModeratorDto extends SignInDto {
  @ApiProperty({})
  // @IsNotEmpty({ message: 'Salary not empty' })
  @IsOptional()
  salary: string;

  @ApiProperty({})
  @IsOptional()
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
