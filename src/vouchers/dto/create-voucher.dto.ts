import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Name voucher must be empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Discount money must be empty' })
  money: number;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(10)
  @IsString()
  key: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Limit money must be empty' })
  @IsNumber()
  @Min(100)
  limit_money: number;
}
