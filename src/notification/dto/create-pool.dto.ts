import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePoolDto {
  @ApiProperty({})
  @IsArray()
  @IsNotEmpty()
  listStores: string[];

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  message: string;
}
