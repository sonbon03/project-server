import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name not be empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Expiry day not be empty' })
  expiryDay: Date;

  // @IsNotEmpty({ message: 'Nanufacture day not be empty' })
  @IsOptional()
  manufactureDate?: Date;

  @IsNotEmpty({ message: 'Measure not be empty' })
  @IsString()
  measure: string;

  @IsNotEmpty({ message: 'Category Id not be empty' })
  @IsString()
  categoryId: string;

  @IsNotEmpty({ message: 'Warehouse Id not be empty' })
  @IsString()
  warehouseId: string;
}
