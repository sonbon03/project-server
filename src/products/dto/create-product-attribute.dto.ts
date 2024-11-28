import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAttributeDto } from './create-attribute.dto';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({})
  @Type(() => CreateProductDto)
  @ValidateNested()
  product: CreateProductDto;

  @ApiProperty({})
  @Type(() => CreateAttributeDto)
  @ValidateNested()
  attributes: CreateAttributeDto[];
}
