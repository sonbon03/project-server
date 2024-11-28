import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @ApiProperty({})
  @IsNotEmpty({ message: 'First name not be empty' })
  @IsString()
  firstName: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Last name not be empty' })
  @IsString()
  lastName: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Birthday not be empty' })
  birthday: Date;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Gender not be empty' })
  gender: Gender;

  role: Roles;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Phone number not be empty' })
  @IsString()
  @Length(10, 10, { message: 'Phone number must 10 character' })
  phone: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salary?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  point?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantityOrder?: number;
}
