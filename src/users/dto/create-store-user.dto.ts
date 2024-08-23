import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { StoreEntity } from '../entities/store.entity';

import { UserEntity } from '../entities/user.entity';
import { StoreDto } from './store.dto';
import { UserDto } from './user.dto';

export class CreateUserStoreDto {
  @Type(() => StoreDto)
  @ValidateNested()
  store: StoreEntity;

  @Type(() => UserDto)
  @ValidateNested()
  user: UserEntity;
}
