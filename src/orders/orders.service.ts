import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoreEntity } from 'src/store/entities/store.entity';
import { StoreService } from 'src/store/store.service';
import { PaymentMethod } from 'src/utils/enums/payment-method.enum';
import {
  StatusAttibute,
  StatusPayment,
} from 'src/utils/enums/user-status.enum';
import { VoucherEnity } from 'src/vouchers/entities/voucher.entity';
import { VouchersService } from 'src/vouchers/vouchers.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';
import { PaymentEntity } from './entities/payment.entity';
import { hash } from 'bcrypt';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly productsService: ProductsService,
    private readonly vouchersService: VouchersService,
    private readonly storeService: StoreService,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentStore: StoreEntity) {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;
    let totalMoneyDiscount: number = 0;
    for (const product of createOrderDto.products) {
      const productAttribute = await this.productsService.findOneAttribute(
        product.id_product,
        product.id_attribute,
      );
      if (productAttribute.attribute.amount < product.quantity) {
        throw new BadRequestException('Not enough quantity');
      }

      if (productAttribute.attribute.status === StatusAttibute.NOT) {
        throw new BadRequestException('Product out of stock');
      }
      const discount = productAttribute.product?.promotion
        ? 1 - Number(productAttribute.product.promotion.percentage) / 100
        : 1;

      totalPrice +=
        productAttribute.attribute.price * product.quantity * discount;

      totalQuantity += product.quantity;

      totalMoneyDiscount = parseFloat(
        (
          productAttribute.attribute.price *
          product.quantity *
          (1 - discount)
        ).toFixed(2),
      );
    }

    let voucher: VoucherEnity;
    if (createOrderDto.id_voucher) {
      voucher = await this.vouchersService.findOne(
        createOrderDto.id_voucher,
        currentStore,
      );
      totalPrice -= voucher?.money;
    }

    if (totalPrice !== createOrderDto.payment.total) {
      throw new BadRequestException('Invalid total price');
    }

    const payment = new PaymentEntity();
    Object.assign(payment, createOrderDto.payment);
    payment.paymentDate = new Date();
    payment.status =
      createOrderDto.payment.paymentMethod === PaymentMethod.CASH ||
      createOrderDto.payment.paymentMethod === PaymentMethod.CARD
        ? StatusPayment.PAID
        : StatusPayment.PENDING;

    const order = new OrderEntity();
    order.payment = payment;

    order.moneyDiscount = voucher
      ? Number(voucher.money) + Number(totalMoneyDiscount)
      : totalMoneyDiscount;

    if (createOrderDto.id_user) {
      const customer = await this.storeService.findOneCustomer(
        createOrderDto.id_user,
        currentStore,
      );
      order.store_customer = customer;
    } else {
      order.store_customer = null;
    }

    order.quantityProduct = totalQuantity;
    order.total = totalPrice;
    order.timeBuy = new Date();
    order.store = currentStore;
    order.name = (await hash(JSON.stringify(order), 10)).substring(0, 10);

    const orderTbl = await this.orderRepository.save(order);

    const opEntity: OrderProductEntity[] = [];

    let point: number;

    for (const product of createOrderDto.products) {
      const orderProductEntity = new OrderProductEntity();
      orderProductEntity.order = order;
      const productAttribute = await this.productsService.findOneAttribute(
        product.id_product,
        product.id_attribute,
      );

      orderProductEntity.productAttribute = productAttribute;
      orderProductEntity.quantity = product.quantity;
      orderProductEntity.discount = productAttribute.product.promotion
        ? Number(productAttribute.product.promotion.percentage)
        : 0;

      const rawPrice =
        productAttribute.attribute.price *
        (1 - orderProductEntity.discount / 100);

      const price: number = Number(Math.round(rawPrice * 100) / 100);
      orderProductEntity.price = price;
      if (price >= 100.0) {
        point = parseFloat(
          (price * orderProductEntity.quantity * 0.01).toFixed(3),
        );
      } else {
        point = 0;
      }

      opEntity.push(orderProductEntity);
      await this.productsService.updateAttribute(
        product.id_attribute,
        product.quantity,
      );
    }

    if (createOrderDto.id_user) {
      await this.storeService.updatePoint(point, createOrderDto.id_user);
    }

    await this.orderProductRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id, currentStore);
  }

  // ============================== BEGIN: Create ORDER ==============================

  // async create(createOrderDto: CreateOrderDto, currentStore: StoreEntity) {
  //   await this.validateProducts(createOrderDto);

  //   const totalQuantity = this.calculateTotalQuantity(createOrderDto);
  //   let totalAmount = this.calculateTotalAmount(createOrderDto);

  //   if (createOrderDto.id_voucher) {
  //     const voucher = await this.vouchersService.findOne(
  //       createOrderDto.id_voucher,
  //       currentStore,
  //     );
  //     totalAmount -= voucher?.money;
  //   }

  //   const order = await this.createOrderEntity(createOrderDto, currentStore);

  //   const opEntity: OrderProductEntity[] =
  //     await this.createOrderProductEntities(order, createOrderDto);

  //   if (createOrderDto.id_user) {
  //     const point = this.calculatePoint(opEntity);
  //     await this.updateEmployeePoints(point, createOrderDto.id_user);
  //   }

  //   const orderTbl = await this.orderRepository.save(order);
  //   await this.orderProductRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(OrderProductEntity)
  //     .values(opEntity)
  //     .execute();

  //   return await this.findOne(orderTbl.id, currentStore);
  // }

  // async validateProducts(createOrderDto: CreateOrderDto) {
  //   for (let i = 0; i < createOrderDto.products.length; i++) {
  //     const productAttribute = await this.productsService.findOneAttribute(
  //       createOrderDto.products[i].id_attribute,
  //       createOrderDto.products[i].id_product,
  //     );
  //     await this.validateProductAttribute(productAttribute);
  //   }
  // }

  // async validateProductAttribute(productAttribute: any) {
  //   if (checkText(productAttribute.attribute.key)) {
  //     throw new BadRequestException('The name contains special characters');
  //   }
  //   if (productAttribute.attribute.status === StatusAttibute.NOT) {
  //     throw new BadRequestException('Product out of stock');
  //   }
  // }

  // calculateTotalQuantity(createOrderDto: CreateOrderDto) {
  //   return createOrderDto.products.reduce(
  //     (sum, product) => sum + product.quantity,
  //     0,
  //   );
  // }

  // calculateTotalAmount(createOrderDto: CreateOrderDto) {
  //   return createOrderDto.products.reduce(
  //     (sum, product) => sum + product.price * product.quantity,
  //     0,
  //   );
  // }

  // async createOrderEntity(
  //   createOrderDto: CreateOrderDto,
  //   currentStore: StoreEntity,
  // ) {
  //   const order = new OrderEntity();
  //   order.store = currentStore;
  //   order.payment = new PaymentEntity();
  //   Object.assign(order.payment, createOrderDto.payment);
  //   order.payment.paymentDate = new Date();
  //   order.payment.status =
  //     createOrderDto.payment.paymentMethod === PaymentMethod.CASH ||
  //     createOrderDto.payment.paymentMethod === PaymentMethod.CARD
  //       ? StatusPayment.PAID
  //       : StatusPayment.PENDING;
  //   order.timeBuy = new Date();
  //   order.quantityProduct = this.calculateTotalQuantity(createOrderDto);
  //   order.total = this.calculateTotalAmount(createOrderDto);

  //   if (createOrderDto.id_voucher) {
  //     const voucher = await this.vouchersService.findOne(
  //       createOrderDto.id_voucher,
  //       currentStore,
  //     );
  //     order.moneyDiscount = voucher?.money || 0;
  //   } else {
  //     order.moneyDiscount = 0;
  //   }

  //   return order;
  // }

  // async createOrderProductEntities(
  //   order: OrderEntity,
  //   createOrderDto: CreateOrderDto,
  // ) {
  //   const opEntity: OrderProductEntity[] = [];
  //   for (let i = 0; i < createOrderDto.products.length; i++) {
  //     const productAttribute = await this.productsService.findOneAttribute(
  //       createOrderDto.products[i].id_attribute,
  //       createOrderDto.products[i].id_product,
  //     );
  //     const orderProductEntity = await this.createOrderProductEntity(
  //       order,
  //       productAttribute,
  //       createOrderDto.products[i].quantity,
  //     );
  //     opEntity.push(orderProductEntity);
  //   }
  //   return opEntity;
  // }

  // async createOrderProductEntity(
  //   order: OrderEntity,
  //   productAttribute: any,
  //   quantity: number,
  // ) {
  //   const orderProductEntity = new OrderProductEntity();
  //   orderProductEntity.order = order;
  //   orderProductEntity.productAttribute = productAttribute;
  //   orderProductEntity.quantity = quantity;
  //   orderProductEntity.discount = productAttribute.promotion
  //     ? Number(productAttribute.promotion.percentage)
  //     : 0;
  //   const rawPrice = this.calculateProductPriceWithPromotion(productAttribute);
  //   const price: number = Number(Math.round(rawPrice * 100) / 100);
  //   orderProductEntity.price = price;
  //   return orderProductEntity;
  // }

  // calculateProductPriceWithPromotion(productAttribute: any) {
  //   if (productAttribute.promotion) {
  //     const price =
  //       productAttribute.attribute.price *
  //       (1 - productAttribute.promotion.percentage / 100);
  //     return price;
  //   }
  //   return productAttribute.attribute.price;
  // }

  // async updateEmployeePoints(point: number, idUser: string) {
  //   await this.employeesService.updatePoint(point, idUser);
  // }

  // calculatePoint(opEntity: OrderProductEntity[]) {
  //   let point: number = 0;
  //   for (let i = 0; i < opEntity.length; i++) {
  //     const orderProductEntity = opEntity[i];
  //     if (orderProductEntity.price >= 100.0) {
  //       point += parseFloat(
  //         (
  //           orderProductEntity.price *
  //           orderProductEntity.quantity *
  //           0.01
  //         ).toFixed(3),
  //       );
  //     }
  //   }
  //   return point;
  // }

  // ============================== END: Create ORDER ==============================

  async findAll(currentStore: StoreEntity) {
    const order = this.orderRepository.find({
      where: { store_customer: { storeId: currentStore.id } },
      relations: {
        orderProducts: {
          productAttribute: true,
        },
        payment: true,
      },
    });
    return order;
  }

  async findAllPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [result, total] = await this.orderRepository.findAndCount({
      where: {
        store: {
          id: currentStore.id,
        },
      },
      relations: {
        payment: true,
        // store: true,
        orderProducts: {
          productAttribute: true,
        },
      },
      skip: skip,
      take: take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findOne(id: string, currentStore: StoreEntity) {
    const order = await this.orderRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
      relations: {
        payment: true,
        store_customer: {
          user: true,
          store: true,
        },
        orderProducts: {
          productAttribute: {
            attribute: true,
            product: true,
          },
        },
      },
    });

    if (!order) throw new BadRequestException('Order not found');
    return order;
  }

  async updateStatusPayment(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
    currentStore: StoreEntity,
  ) {
    const order = await this.findOne(id, currentStore);
    if (
      (order.payment.paymentMethod === PaymentMethod.CARD ||
        order.payment.paymentMethod === PaymentMethod.CASH) &&
      order.payment.status === StatusPayment.PAID
    ) {
      throw new BadRequestException('Customer was payment');
    }
    if (
      order.payment.paymentMethod === PaymentMethod.BANK_TRANSFER &&
      updatePaymentStatusDto.status === StatusPayment.PAID
    ) {
      await this.updateStatus(order, StatusPayment.PAID);
    }
    return await this.findOne(id, currentStore);
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }

  async updateStatus(order: OrderEntity, status: StatusPayment) {
    for (const op of order.orderProducts) {
      await this.productsService.updateStock(
        op.productAttribute.attribute.id,
        op.productAttribute.product.id,
        op.quantity,
        status,
      );
    }
  }

  // async exportDataOrder(
  //   res: Response,
  //   currentStore: StoreEntity,
  // ): Promise<void> {
  //   const orders = await this.orderRepository.find({
  //     where: {
  //       store: { id: currentStore.id },
  //     },
  //     relations: {
  //       employee: true,
  //       payment: true,
  //     },
  //   });
  //   const data = orders.map((order, index: number) => ({
  //     id: index + 1,
  //     quantity_product: order.quantityProduct,
  //     total_price: order.total,
  //     money_discount: order.moneyDiscount,
  //     time_buy: order.timeBuy,
  //     employee: order.employee
  //       ? order.employee.firstName + ' ' + order.employee.lastName
  //       : '',
  //     payment_method: order.payment.paymentMethod,
  //     payment_date: order.payment.paymentDate,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  //   // Ghi file Excel vào buffer
  //   const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  //   // Thiết lập header để tải file Excel
  //   res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );

  //   // Gửi file Excel về phía client
  //   res.send(buffer);
  // }

  // async exportDocxOrder(
  //   res: Response,
  //   currentStore: StoreEntity,
  // ): Promise<any> {
  //   const orders = await this.orderRepository.find({
  //     where: {
  //       store: {
  //         id: currentStore.id,
  //       },
  //     },
  //     relations: {
  //       employee: true,
  //       payment: true,
  //     },
  //   });

  //   const row = orders.map((order, index: number) => {
  //     return new TableRow({
  //       children: [
  //         new TableCell({
  //           children: [new Paragraph(index.toString())],
  //         }),
  //         new TableCell({
  //           children: [
  //             new Paragraph(
  //               order.employee
  //                 ? order.employee.firstName + ' ' + order.employee.lastName
  //                 : ' ',
  //             ),
  //           ],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.quantityProduct.toString())],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.total.toString())],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.moneyDiscount.toString())],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.timeBuy.toISOString())],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.payment.paymentDate.toISOString())],
  //         }),
  //         new TableCell({
  //           children: [new Paragraph(order.payment.paymentMethod)],
  //         }),
  //       ],
  //     });
  //   });

  //   const table = new Table({
  //     width: { size: 100, type: WidthType.PERCENTAGE },
  //     rows: [
  //       new TableRow({
  //         children: [
  //           new TableCell({
  //             children: [new Paragraph('STT')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Name')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Quantity')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Total')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Discount')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Date Bought')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Date Payment')],
  //           }),
  //           new TableCell({
  //             children: [new Paragraph('Method Payment')],
  //           }),
  //         ],
  //       }),
  //       ...row,
  //     ],
  //   });

  //   const docx = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: 'Order Report',
  //                 bold: true,
  //                 size: 20,
  //               }),
  //             ],
  //             heading: 'Heading1',
  //           }),
  //           table,
  //         ],
  //       },
  //     ],
  //   });

  //   const buffer = await Packer.toBuffer(docx);

  //   res.setHeader('Content-Disposition', 'attachment; filename=orders.docx');
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   );
  //   res.send(buffer);
  // }
}
