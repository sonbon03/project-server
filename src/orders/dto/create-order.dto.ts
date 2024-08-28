import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidatePromise } from 'class-validator';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreatePaymentDto } from './create-payment.dto';

export class CreateOrderDto {
  @Type(() => CreateOrderProductDto)
  @ValidatePromise()
  products: CreateOrderProductDto[];

  @Type(() => CreatePaymentDto)
  @ValidatePromise()
  payment: CreatePaymentDto;

  @IsOptional()
  @IsString()
  id_voucher: string;

  @IsOptional()
  @IsString()
  id_user: string;
}
