import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Email can not be empty.' })
  @IsEmail({}, { message: 'Please provide a valid email.' })
  @IsString({ message: 'Email should be string' })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty.' })
  @MinLength(5, { message: 'Password minimum character should be 5.' })
  @IsString({ message: 'Password should be string' })
  password: string;
}
