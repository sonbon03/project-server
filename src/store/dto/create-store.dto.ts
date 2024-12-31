import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Type store not be empty' })
  @IsString()
  typeStore: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  address: string;
}
