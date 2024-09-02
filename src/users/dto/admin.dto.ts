import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';

export class AdminDto extends SignInDto {
  @IsNotEmpty({ message: 'Phone number not empty' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Name not empty' })
  @IsString()
  name: string;
}
