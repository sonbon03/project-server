import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { PromotionEntity } from 'src/promotion/entities/promotion.entity';
import {
  StatusAttibute,
  StatusPayment,
} from 'src/utils/enums/user-status.enum';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { AttributeEntity } from './entities/attribute.entity';
import { ProductAttributeEntity } from './entities/product-attribute.entity';
import { ProductEntity } from './entities/product.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import { UpdateAmountAttributeDto } from './dto/update-amount-attribute.dto';
import { CreatePoolDto } from 'src/notification/dto/create-pool.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Transactional } from 'src/decorators/transaction.decorator';

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

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,

    @InjectDataSource() private readonly _dataSource: DataSource,
  ) {}

  @Transactional()
  async create(
    createProductAttributeDto: CreateProductAttributeDto,
    currentStore: StoreEntity,
    queryRunner?: QueryRunner,
  ) {
    await Promise.all(
      createProductAttributeDto.attributes.map(async (attribute) => {
        if (attribute.manufactureDate > attribute.expiryDay) {
          throw new BadRequestException(
            'Manufacture day must before expiry day',
          );
        }
        if (attribute.priceImport > attribute.price) {
          throw new BadRequestException('Price import must be less than price');
        }
      }),
    );
    let productEntity = new ProductEntity();
    for (const attri of createProductAttributeDto.attributes) {
      const check = await this.findKey(attri.key, currentStore);
      if (check !== null) {
        throw new BadRequestException('Key exists');
      }
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
    productEntity.name = createProductAttributeDto.product.name;
    productEntity.category = category;
    productEntity.warehouse = warehouse;
    productEntity.importDay = new Date();
    productEntity.store = currentStore;

    productEntity = this.productRepository.create(productEntity);

    const productTbl = await queryRunner.manager.save(
      ProductEntity,
      productEntity,
    );

    const attributeTbl: AttributeEntity[] = [];
    for (let i = 0; i < createProductAttributeDto.attributes.length; i++) {
      const data = {
        ...createProductAttributeDto.attributes[i],
        status: StatusAttibute.HAVE,
      };
      const attribute = this.attributeRepository.create(data);
      const attri = await queryRunner.manager.save(AttributeEntity, attribute);
      attributeTbl.push(attri);
    }

    const paEntity: ProductAttributeEntity[] = [];

    for (let i = 0; i < attributeTbl.length; i++) {
      const productAttributeEntity = new ProductAttributeEntity();
      productAttributeEntity.product = productTbl;
      productAttributeEntity.attribute = attributeTbl[i];
      const productAttribute = this.productAttributeRepository.create(
        productAttributeEntity,
      );
      paEntity.push(productAttribute);
    }
    await queryRunner.manager.save(ProductAttributeEntity, paEntity);
    return true;
  }

  // ============================== BEGIN: Create PRODUCTS ==============================
  // async create(
  //   createProductAttributeDto: CreateProductAttributeDto,
  //   currentStore: StoreEntity,
  // ) {
  //   const check = await this.findName(
  //     createProductAttributeDto.product.name,
  //     currentStore,
  //   );
  //   if (check !== null) {
  //     throw new BadRequestException('Name exists');
  //   }
  //   const productEntity = new ProductEntity();
  //   Object.assign(productEntity, createProductAttributeDto.product);
  //   productEntity.name = createProductAttributeDto.product.name.toLowerCase();
  //   productEntity.store = currentStore;
  //   const category = await this.categoryService.findOne(
  //     createProductAttributeDto.product.categoryId,
  //     currentStore,
  //   );
  //   productEntity.category = category;
  //   const warehouse = await this.warehouseService.findById(
  //     createProductAttributeDto.product.warehouseId,
  //   );
  //   if (!warehouse) {
  //     throw new NotFoundException('Warehouses not found');
  //   }
  //   productEntity.warehouse = warehouse;
  //   const productTbl = await this.productRepository.save(productEntity);

  //   const attributeTbl = [];
  //   for (let i = 0; i < createProductAttributeDto.attributes.length; i++) {
  //     const attribute = {
  //       ...createProductAttributeDto.attributes[i],
  //       status: StatusAttibute.HAVE,
  //     };
  //     const attri = await this.attributeRepository.save(attribute);
  //     attributeTbl.push(attri);
  //   }

  //   const paEntity = await this.createProductAttributeEntities(
  //     productTbl,
  //     attributeTbl,
  //   );
  //   await this.saveProductAttributeEntities(paEntity);
  //   return await this.findOneProductAttribute(productTbl.id);
  // }

  // async createProductAttributeEntities(
  //   productEntity: ProductEntity,
  //   attributeTbl: AttributeEntity[],
  // ) {
  //   const paEntity: ProductAttributeEntity[] = [];
  //   for (let i = 0; i < attributeTbl.length; i++) {
  //     const productAttributeEntity = new ProductAttributeEntity();
  //     productAttributeEntity.product = productEntity;
  //     productAttributeEntity.attribute = attributeTbl[i];
  //     paEntity.push(productAttributeEntity);
  //   }
  //   return paEntity;
  // }

  // async saveProductAttributeEntities(paEntity: ProductAttributeEntity[]) {
  //   await this.productAttributeRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(ProductAttributeEntity)
  //     .values(paEntity)
  //     .execute();
  // }

  // ============================== END: Create PRODUCTS ==============================

  async findAll(currentStore: StoreEntity) {
    const products = await this.productAttributeRepository.find({
      where: {
        product: {
          store: { id: currentStore.id },
        },
      },
      relations: {
        product: {
          category: true,
          store: true,
          warehouse: true,
          promotion: true,
        },
        attribute: true,
      },
    });
    if (products.length === 0)
      throw new BadRequestException('Products not found!');
    return products;
  }

  async getNameAll(currentStore: StoreEntity) {
    const products = await this.productRepository.find({
      where: {
        store: { id: currentStore.id },
      },
    });
    if (products.length === 0)
      throw new BadRequestException('Products not found!');
    return products;
  }

  async findKey(key: string, currentStore: StoreEntity) {
    const product = await this.productRepository.findOne({
      where: {
        productAttributes: { attribute: { key: key } },
        store: { id: currentStore.id },
      },
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
      products.map(async (product) => {
        const productAttribute = await this.findOneProductAttribute(
          product.id,
          currentStore,
        );
        const attributes = Object.values(productAttribute.attributes || {});

        return {
          ...productAttribute,
          attributes,
        };
      }),
    );
    const totalPages = Math.ceil(total / limit);
    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findOneAttribute(
    id_product: string,
    id_attribute: string,
  ): Promise<ProductAttributeEntity> {
    const attribute = await this.productAttributeRepository.findOne({
      where: {
        product: {
          id: id_product,
        },
        attribute: { id: id_attribute },
      },
      relations: {
        product: {
          promotion: true,
          store: true,
        },
        attribute: true,
      },
    });

    if (!attribute)
      throw new BadRequestException('Product attribute not found!');
    return attribute;
  }

  async getInfoAttribute(idAttribute: string) {
    const attribute = await this.productAttributeRepository.findOne({
      where: {
        attribute: { id: idAttribute },
      },
      relations: {
        product: true,
        attribute: true,
      },
    });
    if (!attribute) {
      throw new BadRequestException('Attribute not found!');
    }
    return attribute;
  }

  async profitByProductAttribute(id: string) {
    const attributeId = await this.productAttributeRepository.findOne({
      where: { id },
      relations: { attribute: true },
    });
    if (!attributeId) {
      throw new BadRequestException('Product Attribute not found!');
    }
    const attribute = await this.attributeRepository.findOneById(
      attributeId.attribute.id,
    );
    if (!attribute) {
      throw new BadRequestException('Attribute not found!');
    }

    return {
      price: attribute.price,
      profit: attribute.price - attribute.priceImport,
    };
  }

  async findOneProductAttribute(productId: string, currentStote: StoreEntity) {
    const productsAttri = await this.productAttributeRepository.find({
      where: {
        product: {
          id: productId,
          store: {
            id: currentStote.id,
          },
        },
      },
      relations: {
        attribute: true,
        product: {
          promotion: true,
        },
      },
    });
    if (productsAttri.length === 0)
      throw new BadRequestException('Products not found!');

    const result: {
      product: ProductEntity;
      attributes: {
        [key: number]: AttributeEntity;
      };
      promotion: PromotionEntity;
    } = {
      product: productsAttri[0].product,
      attributes: {},
      promotion: productsAttri[0].product.promotion,
    };

    productsAttri.forEach((productAttr, index) => {
      result.attributes[index] = productAttr.attribute;
    });

    return result;
  }

  async update(
    id: string,
    fields: Partial<UpdateProductAttributeDto>,
    currentStore: StoreEntity,
  ) {
    const data = await this.findOneProductAttribute(id, currentStore);
    const product: ProductEntity = Object.assign(data.product, fields.product);
    return await this.productRepository.save(product);
    // if (fields.attributes.length < Object.keys(data.attributes).length) {
    //   for (let i = 0; i < Object.keys(data.attributes).length; i++) {
    //     if (!fields.attributes[i]) {
    //       await this.removeAttribute(data.attributes[i].id, data.product.id);
    //     } else {
    //       const attribute: AttributeEntity = Object.assign(
    //         data.attributes[i],
    //         fields.attributes[i],
    //       );
    //       await this.attributeRepository.save(attribute);
    //     }
    //   }
    // } else {
    // Object.entries(fields.attributes).forEach(async ([key, attri]) => {
    //   if (Object.keys(data.attributes).length < Number(key) + 1) {
    //     await this.addAttribute(attri, data.product.id, currentStore);
    //   } else {
    //     const attribute: AttributeEntity = Object.assign(
    //       data.attributes[key],
    //       attri,
    //     );
    //     await this.attributeRepository.save(attribute);
    //   }
    // });
    // }

    // return await this.findOneProductAttribute(data.product.id);
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
    if (createAttributeDto.priceImport > createAttributeDto.price) {
      throw new BadRequestException('Price import must be less than price');
    }
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
    const products = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!products) {
      throw new BadRequestException('Product not found');
    }
    products.promotion = promotion;
    await this.productRepository.save(products);

    return true;
  }

  async removePromotionProducts(idPromotion: string) {
    const products = await this.productRepository.find({
      where: {
        promotion: { id: idPromotion },
      },
    });
    if (!products) {
      throw new BadRequestException('Product not found');
    }
    for (let i = 0; i < products.length; i++) {
      products[i].promotion = null;
      await this.productAttributeRepository.save(products);
    }
  }

  async updateStock(
    id_attribute: string,
    id_product: string,
    stock: number,
    status: string,
  ) {
    let productAttri = await this.findOneAttribute(id_attribute, id_product);
    if (status === StatusPayment.PAID) {
      if (productAttri.attribute.amount < stock)
        throw new BadRequestException('Insufficient product');
      productAttri.attribute.amount -= stock;
      if (productAttri.attribute.amount === 0)
        productAttri.attribute.status === StatusAttibute.NOT;
    } else {
      productAttri.attribute.amount += stock;
    }
    productAttri = await this.productAttributeRepository.save(productAttri);
    return productAttri;
  }

  async payAttribute(idAttribute: string, quantity: number) {
    const attribute = await this.attributeRepository.findOneById(idAttribute);
    if (!attribute) {
      throw new BadRequestException('Attribute not found');
    }
    if (attribute.amount >= quantity) {
      attribute.amount -= quantity;
    } else {
      throw new BadRequestException('Insufficient product');
    }
    return await this.attributeRepository.save(attribute);
  }

  async updateAmountAttribute(
    updateAmountAttributes: UpdateAmountAttributeDto[],
    currentStore: StoreEntity,
  ) {
    let message = [];
    await Promise.all(
      updateAmountAttributes.map(async (item: UpdateAmountAttributeDto) => {
        const { id_attribute, amount } = item;
        const attribute =
          await this.attributeRepository.findOneById(id_attribute);
        if (!attribute) {
          throw new BadRequestException('Attribute not found');
        }
        attribute.amount += amount;
        message = [...message, item];
        await this.attributeRepository.save(attribute);
      }),
    );

    if (message.length > 0) {
      const poolData: CreatePoolDto = {
        listStores: [currentStore.id],
        title: 'Thêm sản phẩm',
        message: JSON.stringify(message),
      };
      await this.notificationService.createPool(poolData);
    }
    return;
  }
}
