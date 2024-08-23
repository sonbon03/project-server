import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class StoreDto {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @IsNotEmpty({ message: 'Name store not be empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Type store not be empty' })
  @IsString()
  typeStore: string;

  @IsString()
  address: string;
}
