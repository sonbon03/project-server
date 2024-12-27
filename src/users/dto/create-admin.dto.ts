import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { SignInDto } from './signin.dto';

export class CreateAdminDto extends SignInDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Phone not empty' })
  @IsString()
  @Length(10, 10, { message: 'Phone number must 10 character' })
  phone: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Phone not empty' })
  @IsString()
  first_name: string;
}
