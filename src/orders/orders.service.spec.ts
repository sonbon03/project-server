import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderProductEntity } from './entities/order-product.entity';
import { StoreEntity } from '../users/entities/store.entity';
import { VouchersService } from '../vouchers/vouchers.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Gender } from '../utils/enums/user-gender.enum';
import { Roles } from '../utils/enums/user-roles.enum';
import { Timestamp } from 'typeorm';
import { StatusPayment } from '../utils/enums/user-status.enum';
import { PaymentMethod } from '../utils/enums/payment-method.enum';
import { ProductsService } from '../products/products.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let orderRepositoryMock: { save: jest.Mock };
  let orderProductRepositoryMock: { createQueryBuilder: jest.Mock };
  let vouchersServiceMock: { findOne: jest.Mock };
  let productsServiceMock: { validateProducts: jest.Mock };

  beforeEach(async () => {
    orderRepositoryMock = {
      save: jest.fn(),
    };

    orderProductRepositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      }),
    };

    vouchersServiceMock = {
      findOne: jest.fn(),
    };

    productsServiceMock = {
      validateProducts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: orderRepositoryMock,
        },
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: orderProductRepositoryMock,
        },
        { provide: VouchersService, useValue: vouchersServiceMock },
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a BadRequestException if product validation fails', async () => {
    const createOrderDto: CreateOrderDto = {
      products: [], // Intentionally invalid
      payment: new CreatePaymentDto(), // Ensure this is a valid payment object
      id_voucher: undefined,
      id_user: undefined,
    };

    jest
      .spyOn(productsServiceMock, 'validateProducts')
      .mockRejectedValueOnce(new BadRequestException());

    await expect(
      ordersService.create(createOrderDto, {} as StoreEntity),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create an order successfully without a voucher', async () => {
    const createOrderDto: CreateOrderDto = {
      products: [new CreateOrderProductDto()], // Ensure this contains valid data
      payment: new CreatePaymentDto(), // Ensure valid payment data
      id_user: 'user-id',
      id_voucher: undefined,
    };

    const currentStore: StoreEntity = {
      id: '0466c77e-6314-4c51-8664-9a4b159237b8',
      name: 'store 1',
      typeStore: '1',
      address: 'asaa',
      user: null,
      employees: [],
      warehouse: [],
      category: [],
      products: [],
      promotions: [],
      orders: [],
      vouchers: [],
    };

    jest
      .spyOn(productsServiceMock, 'validateProducts')
      .mockResolvedValueOnce({});
    jest.spyOn(ordersService, 'calculateTotalQuantity').mockReturnValueOnce(5);
    jest.spyOn(ordersService, 'calculateTotalAmount').mockReturnValueOnce(1000);
    jest.spyOn(ordersService, 'createOrderEntity').mockResolvedValueOnce({
      id: 'order-id',
      quantityProduct: 5,
      timeBuy: new Date(),
      total: 1000,
      moneyDiscount: 100,
      store: currentStore,
      createdAt: new Date() as unknown as Timestamp,
      updatedAt: new Date() as unknown as Timestamp,
      employee: {
        id: '3ce9f636-d4fe-4a51-829b-151f116229d6',
        firstName: 's',
        lastName: 'thai',
        birthday: new Date('2024-09-17 00:00:00'),
        gender: Gender.MALE,
        phone: '0987654321',
        salary: 0,
        point: 0,
        roles: Roles.CUSTOMER,
        quantityOrder: 0,
        createdAt: new Date() as unknown as Timestamp,
        updatedAt: new Date() as unknown as Timestamp,
        store: currentStore,
        orders: [],
      },
      orderProducts: [],
      payment: {
        id: 'payment-id',
        total: 10,
        status: StatusPayment.PAID,
        createdAt: new Date() as unknown as Timestamp,
        updatedAt: new Date() as unknown as Timestamp,
        paymentMethod: PaymentMethod.CASH,
        paymentDate: undefined,
        order: new OrderEntity(),
      },
    });

    jest
      .spyOn(ordersService, 'createOrderProductEntities')
      .mockResolvedValueOnce([]);
    jest.spyOn(ordersService, 'calculatePoint').mockReturnValueOnce(100);
    jest.spyOn(ordersService, 'updateEmployeePoints').mockResolvedValueOnce();
    orderRepositoryMock.save.mockResolvedValueOnce({ id: 'order-id' });

    const result = await ordersService.create(createOrderDto, currentStore);

    expect(result).toBeDefined();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'order-id',
        quantityProduct: 5,
        total: 1000,
      }),
    );
    expect(
      orderProductRepositoryMock.createQueryBuilder().insert,
    ).toHaveBeenCalled();
  });

  it('should apply voucher discount when a voucher is provided', async () => {
    const createOrderDto: CreateOrderDto = {
      products: [new CreateOrderProductDto()],
      payment: new CreatePaymentDto(),
      id_voucher: 'voucher-id',
      id_user: 'user-id',
    };

    const currentStore: StoreEntity = {
      id: '0466c77e-6314-4c51-8664-9a4b159237b8',
      name: 'store 1',
      typeStore: '1',
      address: 'asaa',
      user: null,
      employees: [],
      warehouse: [],
      category: [],
      products: [],
      promotions: [],
      orders: [],
      vouchers: [],
    };

    jest
      .spyOn(productsServiceMock, 'validateProducts')
      .mockResolvedValueOnce({});
    jest.spyOn(ordersService, 'calculateTotalQuantity').mockReturnValueOnce(5);
    jest.spyOn(ordersService, 'calculateTotalAmount').mockReturnValueOnce(1000);
    jest
      .spyOn(vouchersServiceMock, 'findOne')
      .mockResolvedValueOnce({ money: 100 }); // Ensure this returns a valid voucher object

    jest.spyOn(ordersService, 'createOrderEntity').mockResolvedValueOnce({
      id: 'order-id',
      quantityProduct: 5,
      timeBuy: new Date(),
      total: 900, // total after discount
      moneyDiscount: 100,
      store: currentStore,
      createdAt: new Date() as unknown as Timestamp,
      updatedAt: new Date() as unknown as Timestamp,
      employee: {
        id: '3ce9f636-d4fe-4a51-829b-151f116229d6',
        firstName: 's',
        lastName: 'thai',
        birthday: new Date('2024-09-17 00:00:00'),
        gender: Gender.MALE,
        phone: '0987654321',
        salary: 0,
        point: 0,
        roles: Roles.CUSTOMER,
        quantityOrder: 0,
        createdAt: new Date() as unknown as Timestamp,
        updatedAt: new Date() as unknown as Timestamp,
        store: currentStore,
        orders: [],
      },
      orderProducts: [],
      payment: {
        id: 'payment-id',
        total: 10,
        status: StatusPayment.PAID,
        createdAt: new Date() as unknown as Timestamp,
        updatedAt: new Date() as unknown as Timestamp,
        paymentMethod: PaymentMethod.CASH,
        paymentDate: undefined,
        order: new OrderEntity(),
      },
    });

    jest
      .spyOn(ordersService, 'createOrderProductEntities')
      .mockResolvedValueOnce([]);
    jest.spyOn(ordersService, 'calculatePoint').mockReturnValueOnce(100);
    jest.spyOn(ordersService, 'updateEmployeePoints').mockResolvedValueOnce();
    orderRepositoryMock.save.mockResolvedValueOnce({ id: 'order-id' });

    const result = await ordersService.create(createOrderDto, currentStore);

    expect(result).toBeDefined();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'order-id',
        total: 900, // total after discount
      }),
    );
  });
});
