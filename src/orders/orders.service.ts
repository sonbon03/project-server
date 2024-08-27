import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { ProductsService } from 'src/products/products.service';
import { StoreEntity } from 'src/users/entities/store.entity';
import {
  StatusAttibute,
  StatusPayment,
} from 'src/utils/enums/user-status.enum';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentMethod } from 'src/utils/enums/payment-method.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly productsService: ProductsService,
    private readonly employeesService: EmployeesService,
  ) {}
  async create(createOrderDto: CreateOrderDto, currentStore: StoreEntity) {
    for (let i = 0; i < createOrderDto.products.length; i++) {
      const productAttribute = await this.productsService.findOneAttribute(
        createOrderDto.products[i].id_attribute,
        createOrderDto.products[i].id_product,
      );
      if (productAttribute.attribute.status === StatusAttibute.NOT) {
        throw new BadRequestException('Product out of stock');
      }
    }
    const payment = new PaymentEntity();
    Object.assign(payment, createOrderDto.payment);
    payment.paymentDate = new Date();
    const order = new OrderEntity();
    order.payment = payment;
    order.store = currentStore;
    console.log(createOrderDto.id_user);
    if (createOrderDto.id_user) {
      const employee = await this.employeesService.findOneCustomer(
        createOrderDto.id_user,
        currentStore,
      );
      order.employee = employee;
    } else {
      order.employee = null;
    }

    const totalQuantity = createOrderDto.products.reduce(
      (sum, product) => sum + product.quantity,
      0,
    );
    const totalAmount = createOrderDto.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
    order.quantityProduct = totalQuantity;
    order.total = totalAmount;
    order.timeBuy = new Date();

    const orderTbl = await this.orderRepository.save(order);

    const opEntity: OrderProductEntity[] = [];

    let point: number;

    for (let i = 0; i < createOrderDto.products.length; i++) {
      const orderProductEntity = new OrderProductEntity();
      orderProductEntity.order = order;
      const productAttribute = await this.productsService.findOneAttribute(
        createOrderDto.products[i].id_attribute,
        createOrderDto.products[i].id_product,
      );

      orderProductEntity.productAttribute = productAttribute;
      orderProductEntity.quantity = createOrderDto.products[i].quantity;
      orderProductEntity.discount = productAttribute.promotion
        ? Number(productAttribute.promotion.percentage)
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
    }

    await this.employeesService.updatePoint(point, createOrderDto.id_user);

    await this.orderProductRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id, currentStore);
  }

  async findAll(currentStore: StoreEntity) {
    const order = this.orderRepository.find({
      where: { store: { id: currentStore.id } },
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
      where: { store: { id: currentStore.id } },
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
      data: result,
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
        store: true,
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
      (order.payment.paymentMethod === PaymentMethod.BANK_TRANSFER ||
        order.payment.paymentMethod === PaymentMethod.CASH) &&
      order.payment.status === StatusPayment.PAID
    ) {
      throw new BadRequestException('Customer was payment');
    }
    if (
      (order.payment.paymentMethod === PaymentMethod.BANK_TRANSFER ||
        order.payment.paymentMethod === PaymentMethod.CASH) &&
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
}
