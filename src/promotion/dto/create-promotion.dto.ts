import { IsNotEmpty, IsPositive, IsString, Max } from 'class-validator';

export class CreatePromotionDto {
  @IsNotEmpty({ message: 'Product Id is not empty' })
  product_id: string[];

  @IsNotEmpty({ message: 'Promotion Name is not empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Promotion percentage is not empty' })
  @IsPositive({ message: 'Percentage can not be negative' })
  @Max(100, { message: 'Percentage cannot exceed 100' })
  percentage: number;

  @IsNotEmpty({ message: 'Promotion quantity is not empty' })
  @IsPositive({ message: 'Quantity can not be negative' })
  quantity: number;

  @IsNotEmpty({ message: 'Promotion start day is not empty' })
  startDay: Date;

  @IsNotEmpty({ message: 'Promotion end day is not empty' })
  endDay: Date;
}
