import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAmountAttributeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Attribute not empty' })
  @IsString()
  id_attribute: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Amount not empty' })
  amount: number;
}
