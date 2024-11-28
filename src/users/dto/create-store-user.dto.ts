import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { StoreEntity } from '../entities/store.entity';

import { UserEntity } from '../entities/user.entity';
import { StoreDto } from './store.dto';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStoreDto {
  @ApiProperty({})
  @Type(() => StoreDto)
  @ValidateNested()
  store: StoreEntity;

  @ApiProperty({})
  @Type(() => CreateUserDto)
  @ValidateNested()
  user: UserEntity;
}
