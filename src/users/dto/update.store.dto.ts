import { IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/utils/enums/user-status.enum';

export class UpdateStoreStatus {
  @IsNotEmpty({ message: '' })
  @IsString()
  status: Status;
}
