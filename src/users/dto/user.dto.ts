import { PrimaryGeneratedColumn } from 'typeorm';
import { SignInDto } from './signin.dto';
import { v4 as uuidv4 } from 'uuid';

export class UserDto extends SignInDto {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();
}
