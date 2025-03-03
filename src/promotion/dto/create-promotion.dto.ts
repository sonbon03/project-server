import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Product Id is not empty' })
  product_id: string[];

  @ApiProperty({})
  @IsNotEmpty({ message: 'Promotion Name is not empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(5)
  @IsString()
  key: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Promotion percentage is not empty' })
  percentage: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Promotion quantity is not empty' })
  @IsPositive({ message: 'Quantity can not be negative' })
  quantity: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Promotion start day is not empty' })
  startDay: Date;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Promotion end day is not empty' })
  endDay: Date;
}
