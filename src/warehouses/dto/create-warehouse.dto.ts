import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Name is not empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNumber()
  @Min(0)
  limit: number;
}
