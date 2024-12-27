import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateCustomerDto extends CreateUserDto {
  @ApiProperty({})
  @IsOptional()
  point?: string;

  @ApiProperty({})
  @IsOptional()
  quantityOrder?: number;
}
