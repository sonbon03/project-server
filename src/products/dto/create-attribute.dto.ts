import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { StatusAttibute } from 'src/utils/enums/user-status.enum';

export class CreateAttributeDto {
  @IsNotEmpty({ message: 'Key not be empty' })
  @IsString()
  key: string;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  status: StatusAttibute;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  price: number;
}
