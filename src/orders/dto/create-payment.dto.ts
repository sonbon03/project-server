import { IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';
import { StatusPayment } from '../../utils/enums/user-status.enum';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Payment method not be empty' })
  paymentMethod: PaymentMethod;

  // @IsNotEmpty({ message: 'Payment date not be empty' })
  paymentDate: Date;

  @IsNotEmpty({ message: 'Amount not be empty' })
  total: number;

  // @IsNotEmpty({ message: 'Status payment not be empty' })
  status: StatusPayment;
}
