import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidatePromise,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateStoreDto } from './create-store.dto';

export class CreateCustomerStoreDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Store not empty' })
  @IsString()
  storeId: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'User not empty' })
  @IsString()
  userId: string;

  @ApiProperty({})
  @IsOptional()
  point: string;

  @ApiProperty({})
  @IsOptional()
  quantityOrder: string;

  @ApiProperty({ type: CreateUserDto })
  @Type(() => CreateUserDto)
  @ValidatePromise()
  user: CreateUserDto;

  @ApiProperty({ type: CreateStoreDto })
  @Type(() => CreateStoreDto)
  @ValidatePromise()
  store: CreateStoreDto;
}
