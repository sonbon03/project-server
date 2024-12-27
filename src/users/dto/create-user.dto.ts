import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/utils/enums/user-gender.enum';
import { Index } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'First name not empty' })
  @IsString()
  first_name: string;

  @Index()
  @ApiProperty({})
  @IsNotEmpty({ message: 'Phone not empty' })
  @IsString()
  phone: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Gender not empty' })
  gender: Gender;
}
