import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../../utils/enums/user-status.enum';

export class UpdateStoreStatusDto {
  @IsNotEmpty({ message: '' })
  @IsString()
  @IsIn([Status.CANCEL, Status.PENDING])
  status: string;
}
