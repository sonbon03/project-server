import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Type store not be empty' })
  @IsString()
  typeStore: string;

  @ApiProperty({})
  @IsString()
  address: string;
}
