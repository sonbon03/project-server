import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from 'src/utils/enums/user-gender.enum';
import { Roles } from 'src/utils/enums/user-roles.enum';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'First name not be empty' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Last name not be empty' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Birthday not be empty' })
  birthday: Date;

  @IsNotEmpty({ message: 'Gender not be empty' })
  gender: Gender;

  role: Roles;

  @IsNotEmpty({ message: 'Phone number not be empty' })
  @IsString()
  @Length(10, 10, { message: 'Phone number must 10 character' })
  phone: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  point?: number;

  @IsOptional()
  @IsNumber()
  quantityOrder?: number;
}
