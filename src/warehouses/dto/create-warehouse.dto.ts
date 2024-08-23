import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateWarehouseDto {
  @IsNotEmpty({ message: 'Name is not empty' })
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  limit: number;
}
