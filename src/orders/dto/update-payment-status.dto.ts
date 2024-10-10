import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { StatusPayment } from '../../utils/enums/user-status.enum';

export class UpdatePaymentStatusDto {
  @IsNotEmpty({ message: '' })
  @IsString()
  @IsIn([StatusPayment.PAID, StatusPayment.PENDING])
  status: string;
}
