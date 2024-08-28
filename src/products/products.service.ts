import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { StoreEntity } from 'src/users/entities/store.entity';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { AttributeEntity } from './entities/attribute.entity';
import { ProductAttributeEntity } from './entities/product-attribute.entity';
import { ProductEntity } from './entities/product.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';
import {
  StatusAttibute,
  StatusPayment,
} from 'src/utils/enums/user-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(AttributeEntity)
    private readonly attributeRepository: Repository<AttributeEntity>,
    @InjectRepository(ProductAttributeEntity)
    private readonly productAttributeRepository: Repository<ProductAttributeEntity>,
    private readonly categoryService: CategoriesService,
    private readonly warehouseService: WarehousesService,
  ) {}
  async create(
    createProductAttributeDto: CreateProductAttributeDto,
    currentStore: StoreEntity,
  ) {
    const productEntity = new ProductEntity();

    const check = await this.findName(
      createProductAttributeDto.product.name,
      currentStore,
    );
    if (check !== null) {
      throw new BadRequestException('Name exists');
    }
    Object.assign(productEntity, createProductAttributeDto.product);
    const category = await this.categoryService.findOne(
      createProductAttributeDto.product.categoryId,
      currentStore,
    );
    const warehouse = await this.warehouseService.findById(
      createProductAttributeDto.product.warehouseId,
    );
    if (!warehouse) {
      throw new NotFoundException('Warehouses not found');
    }
    productEntity.name = createProductAttributeDto.product.name.toLowerCase();
    productEntity.category = category;
    productEntity.store = currentStore;
    productEntity.warehouse = warehouse;

    const productTbl = await this.productRepository.save(productEntity);
    const attributeTbl: AttributeEntity[] = [];
    for (let i = 0; i < createProductAttributeDto.attributes.length; i++) {
      const attri = await this.attributeRepository.save(
        createProductAttributeDto.attributes[i],
      );
      attributeTbl.push(attri);
    }

    const paEntity: ProductAttributeEntity[] = [];

    for (let i = 0; i < attributeTbl.length; i++) {
      const productAttributeEntity = new ProductAttributeEntity();
      productAttributeEntity.product = productTbl;
      productAttributeEntity.attribute = attributeTbl[i];
      paEntity.push(productAttributeEntity);
    }
    await this.productAttributeRepository
      .createQueryBuilder()
      .insert()
      .into(ProductAttributeEntity)
      .values(paEntity)
      .execute();
    return await this.findOneProductAttribute(productTbl.id);
  }

  async findAll(currentStore: StoreEntity) {
    const products = await this.productRepository.find({
      where: { store: { id: currentStore.id } },
      relations: {
        category: true,
        store: true,
        warehouse: true,
      },
    });
    if (!products) throw new BadRequestException('Products not found!');
    return products;
  }

  async findName(name: string, currentStore: StoreEntity) {
    const nameProduct = name.toLowerCase();
    const product = await this.productRepository.findOne({
      where: { name: nameProduct, store: { id: currentStore.id } },
    });
    if (!product) return null;
    return product.id;
  }

  async findOne(id: string, currentStore: StoreEntity) {
    const product = await this.productRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
      relations: {
        category: true,
        store: true,
      },
    });
    if (!product) throw new BadRequestException('Product not found!');
    return product;
  }

  async findAllProductPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [products, total] = await this.productRepository.findAndCount({
      where: { store: { id: currentStore.id } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const result = await Promise.all(
      products.map((product) => this.findOneProductAttribute(product.id)),
    );
    const totalPages = Math.ceil(total / limit);
    return {
      data: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findOneAttribute(
    id_attribute: string,
    id_product: string,
  ): Promise<ProductAttributeEntity> {
    const attribute = await this.productAttributeRepository.findOne({
      where: { product: { id: id_product }, attribute: { id: id_attribute } },
      relations: {
        attribute: true,
        promotion: true,
      },
    });
    if (!attribute)
      throw new BadRequestException('Product attribute not found!');
    return attribute;
  }

  async findOneProductAttribute(productId: string) {
    const productAttribute = await this.productAttributeRepository.find({
      where: { product: { id: productId } },
      relations: {
        product: true,
        attribute: true,
        promotion: true,
      },
    });
    if (!productAttribute || productAttribute.length === 0)
      throw new BadRequestException('ProductAttribute not found!');

    const result: {
      product: ProductEntity;
      attributes: {
        [key: number]: AttributeEntity;
      };
      promotion: PromotionEntity;
    } = {
      product: productAttribute[0].product,
      attributes: {},
      promotion: productAttribute[0].promotion,
    };

    productAttribute.forEach((productAttr, index) => {
      result.attributes[index] = productAttr.attribute;
    });

    return result;
  }

  async update(
    id: string,
    fields: Partial<UpdateProductAttributeDto>,
    currentStore: StoreEntity,
  ) {
    const data = await this.findOneProductAttribute(id);
    Object.assign(data.product, fields.product);
    const product: ProductEntity = Object.assign(data.product, fields.product);
    await this.productRepository.save(product);
    if (fields.attributes.length < Object.keys(data.attributes).length) {
      for (let i = 0; i < Object.keys(data.attributes).length; i++) {
        if (!fields.attributes[i]) {
          await this.removeAttribute(data.attributes[i].id, data.product.id);
        } else {
          const attribute: AttributeEntity = Object.assign(
            data.attributes[i],
            fields.attributes[i],
          );
          await this.attributeRepository.save(attribute);
        }
      }
    } else {
      Object.entries(fields.attributes).forEach(async ([key, attri]) => {
        if (Object.keys(data.attributes).length < Number(key) + 1) {
          await this.addAttribute(attri, data.product.id, currentStore);
        } else {
          const attribute: AttributeEntity = Object.assign(
            data.attributes[key],
            attri,
          );
          await this.attributeRepository.save(attribute);
        }
      });
    }

    return await this.findOneProductAttribute(data.product.id);
  }

  async addAttribute(
    createAttributeDto: CreateAttributeDto,
    idProduct: string,
    currentStore: StoreEntity,
  ) {
    const product = await this.productRepository.findOneBy({
      id: idProduct,
      store: { id: currentStore.id },
    });
    if (!product) throw new BadRequestException('Product not found!');
    const attribute = await this.attributeRepository.save(
      this.attributeRepository.create(createAttributeDto),
    );
    const productAttribute = await this.productAttributeRepository.save(
      this.productAttributeRepository.create({
        product,
        attribute,
      }),
    );
    return productAttribute;
  }

  async removeAttribute(idAttribute: string, idProduct: string) {
    const productAttribute = await this.productAttributeRepository.findOne({
      where: { attribute: { id: idAttribute }, product: { id: idProduct } },
    });

    if (!productAttribute) {
      throw new BadRequestException('ProductAttribute not found!');
    }

    await this.productAttributeRepository.delete(productAttribute.id);

    const remainingProductAttributes =
      await this.productAttributeRepository.find({
        where: { attribute: { id: idAttribute } },
      });

    if (remainingProductAttributes.length === 0) {
      await this.attributeRepository.delete(idAttribute);
    }
  }

  async remove(idProduct: string) {
    const productAttributes = await this.productAttributeRepository.find({
      where: { product: { id: idProduct } },
      relations: {
        attribute: true,
      },
    });
    if (!productAttributes || productAttributes.length === 0)
      throw new BadRequestException('Product not found');
    for (const productAttribute of productAttributes) {
      await this.removeAttribute(productAttribute.attribute.id, idProduct);
    }
    const product = await this.productRepository.delete(idProduct);
    return product;
  }

  async addPromotion(id: string, promotion: PromotionEntity) {
    const products = await this.productAttributeRepository.find({
      where: {
        product: {
          id: id,
        },
      },
    });
    if (!products) {
      throw new BadRequestException('Product not found');
    }
    for (let i = 0; i < products.length; i++) {
      products[i].promotion = promotion;
      await this.productAttributeRepository.save(products);
    }
  }

  async updateStock(
    id_attribute: string,
    id_product: string,
    stock: number,
    status: string,
  ) {
    console.log(id_attribute);
    console.log(id_product);
    let product = await this.findOneAttribute(id_attribute, id_product);
    if (status === StatusPayment.PAID) {
      if (product.attribute.amount < stock)
        throw new BadRequestException('Insufficient product');
      product.attribute.amount -= stock;
      if (product.promotion) {
        product.promotion.quantity -= 1;
        if (product.promotion.quantity === 0) product.promotion = null;
      }
      if (product.attribute.amount === 0)
        product.attribute.status === StatusAttibute.NOT;
    } else {
      product.attribute.amount += stock;
    }
    product = await this.productAttributeRepository.save(product);
    return product;
  }
}
