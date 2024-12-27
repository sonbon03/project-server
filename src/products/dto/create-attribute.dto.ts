import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { StatusAttibute } from 'src/utils/enums/user-status.enum';

export class CreateAttributeDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Value not be empty' })
  @IsString()
  value: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(10)
  @IsString()
  key: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Description not be empty' })
  @IsString()
  description: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Expiry day not be empty' })
  expiryDay: Date;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Manufacture day not be empty' })
  @IsOptional()
  manufactureDate: Date;

  status: StatusAttibute;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  price: number;
}
