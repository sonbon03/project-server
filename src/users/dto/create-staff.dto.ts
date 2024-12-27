import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateStaffDto extends CreateUserDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Salary not empty' })
  salary: string;
}
