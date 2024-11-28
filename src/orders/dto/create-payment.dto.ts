import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaymentMethod } from 'src/utils/enums/payment-method.enum';
import { StatusPayment } from 'src/utils/enums/user-status.enum';

export class CreatePaymentDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Payment method not be empty' })
  paymentMethod: PaymentMethod;

  // @IsNotEmpty({ message: 'Payment date not be empty' })
  paymentDate: Date;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Amount not be empty' })
  total: number;

  // @IsNotEmpty({ message: 'Status payment not be empty' })
  status: StatusPayment;
}
