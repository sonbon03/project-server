import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SignInDto } from './signin.dto';

export class UserDto extends SignInDto {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  // @IsOptional()
  // @IsString()
  // firstName: string;

  // @IsOptional()
  // @IsString()
  // lastName: string;

  // @IsOptional()
  // birthday: Date;

  // @IsOptional()
  // gender: Gender;

  // @IsOptional()
  // @IsString()
  // @Length(10, 10, { message: 'Phone number must 10 character' })
  // phone: string;

  // @IsOptional()
  // @IsNumber()
  // salary: number;
}
