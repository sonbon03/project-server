import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SignInDto } from './signin.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Roles } from 'src/utils/enums/user-roles.enum';

export class CreateUserDto extends SignInDto {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @IsNotEmpty({ message: 'Name not empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Phone number not empty' })
  @Length(10, 10, { message: 'Phone number must 10 character' })
  @IsString()
  @IsOptional()
  phone: string;

  role: Roles;
}
