import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({})
  @IsNotEmpty({ message: 'Name category not be empty' })
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty({ message: 'Key not be empty' })
  @Length(10)
  @IsString()
  key: string;
}
