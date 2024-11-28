import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePoolDto {
  @IsArray()
  @IsNotEmpty()
  listStores: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
