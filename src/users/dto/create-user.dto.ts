import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SignInDto } from './signin.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Roles } from 'src/utils/enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends SignInDto {
  @ApiProperty({})
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({})
  @IsNotEmpty({ message: 'Name not empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Phone number not empty' })
  @Length(10, 10, { message: 'Phone number must 10 character' })
  @IsString()
  @IsOptional()
  phone: string;

  role: Roles;
}
