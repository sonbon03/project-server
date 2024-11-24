import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty({ message: 'Name voucher must be empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Discount money must be empty' })
  @IsNumber()
  @Min(0)
  money: number;

  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(10)
  @IsString()
  key: string;

  @IsNotEmpty({ message: 'Limit money must be empty' })
  @IsNumber()
  @Min(100)
  limit_money: number;
}
