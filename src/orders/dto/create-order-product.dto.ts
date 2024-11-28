import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Id Product not empty' })
  id_product: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Id Attribute not empty' })
  id_attribute: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Quantity not empty' })
  quantity: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Price not empty' })
  price: number;

  @Min(0)
  discount: number;
}
