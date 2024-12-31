import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateAttributeDto } from './create-attribute.dto';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({ type: CreateProductDto })
  @Type(() => CreateProductDto)
  @ValidateNested()
  product: CreateProductDto;

  @ApiProperty({ type: [CreateAttributeDto] })
  @Type(() => CreateAttributeDto)
  @ValidateNested({ each: true })
  @IsArray()
  attributes: CreateAttributeDto[];
}
