import { Type } from 'class-transformer';
import { CreateOrderProductDto } from './create-order-product.dto';
import { IsString, ValidatePromise } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class CreateOrderDto {
  @Type(() => CreateOrderProductDto)
  @ValidatePromise()
  products: CreateOrderProductDto[];

  @Type(() => CreatePaymentDto)
  @ValidatePromise()
  payment: CreatePaymentDto;

  @IsString()
  id_user: string;
}
