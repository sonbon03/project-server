import { IsNotEmpty, Min } from 'class-validator';

export class CreateOrderProductDto {
  @IsNotEmpty({ message: 'Id Product not empty' })
  id_product: string;

  @IsNotEmpty({ message: 'Id Attribute not empty' })
  id_attribute: string;

  @IsNotEmpty({ message: 'Quantity not empty' })
  quantity: number;

  @IsNotEmpty({ message: 'Price not empty' })
  price: number;

  @Min(0)
  discount: number;
}
