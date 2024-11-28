import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidatePromise } from 'class-validator';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreatePaymentDto } from './create-payment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({})
  @Type(() => CreateOrderProductDto)
  @ValidatePromise()
  products: CreateOrderProductDto[];

  @ApiProperty({})
  @Type(() => CreatePaymentDto)
  @ValidatePromise()
  payment: CreatePaymentDto;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  id_voucher: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  id_user: string;
}
