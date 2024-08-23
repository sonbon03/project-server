import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAttributeDto } from './create-attribute.dto';
import { CreateProductDto } from './create-product.dto';

export class CreateProductAttributeDto {
  @Type(() => CreateProductDto)
  @ValidateNested()
  product: CreateProductDto;

  @Type(() => CreateAttributeDto)
  @ValidateNested()
  attributes: CreateAttributeDto[];
}
