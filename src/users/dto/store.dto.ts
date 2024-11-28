import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class StoreDto {
  @ApiProperty({})
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({})
  @IsNotEmpty({ message: 'Type store not be empty' })
  @IsString()
  typeStore: string;

  @ApiProperty({})
  @IsString()
  address: string;
}
