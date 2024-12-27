import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Status } from 'src/utils/enums/user-status.enum';

export class UpdateStoreStatus {
  @ApiProperty({})
  @IsNotEmpty({ message: '' })
  status: Status;
}
