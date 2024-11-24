import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { StatusAttibute } from 'src/utils/enums/user-status.enum';

export class CreateAttributeDto {
  @IsNotEmpty({ message: 'Value not be empty' })
  @IsString()
  value: string;

  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(10)
  @IsString()
  key: string;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  amount: number;

  status: StatusAttibute;

  @IsNotEmpty({ message: 'Description not be empty' })
  @IsNumber()
  @Min(1)
  price: number;
}
