import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Name not be empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Measure not be empty' })
  @IsString()
  measure: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Category Id not be empty' })
  @IsString()
  categoryId: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Warehouse Id not be empty' })
  @IsString()
  warehouseId: string;
}
