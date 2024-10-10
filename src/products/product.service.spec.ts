// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ProductEntity } from './entities/product.entity';
// import { AttributeEntity } from './entities/attribute.entity';
// import { WarehousesService } from '../warehouses/warehouses.service';
// import { CategoriesService } from '../categories/categories.service';
// import { StatusAttibute } from '../utils/enums/user-status.enum';
// import { StoreEntity } from '../users/entities/store.entity';
// import { ProductAttributeEntity } from './entities/product-attribute.entity';
// import { PromotionService } from '../promotion/promotion.service'; // Import the PromotionService

// // Define an interface for the mock PromotionService
// interface PromotionServiceMock {
//   findActivePromotions: jest.Mock;
//   // Add other methods as needed
// }

// describe('ProductsService', () => {
//   let service: ProductsService;
//   let productRepositoryMock: { save: jest.Mock };
//   let attributeRepositoryMock: { save: jest.Mock };
//   let productAttributeRepositoryMock: { save: jest.Mock };
//   let categoryServiceMock: Partial<Record<keyof CategoriesService, jest.Mock>>;
//   let warehouseServiceMock: Partial<Record<keyof WarehousesService, jest.Mock>>;
//   let promotionServiceMock: PromotionServiceMock; // Change here to use the new interface

//   beforeEach(async () => {
//     productRepositoryMock = {
//       save: jest.fn(),
//     };
//     attributeRepositoryMock = {
//       save: jest.fn(),
//     };
//     productAttributeRepositoryMock = {
//       save: jest.fn(),
//     };
//     categoryServiceMock = {
//       findOne: jest.fn() as jest.Mock,
//     };
//     warehouseServiceMock = {
//       findById: jest.fn() as jest.Mock,
//     };
//     promotionServiceMock = {
//       findActivePromotions: jest.fn() as jest.Mock, // Mock the method here
//       // Add other methods as needed
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ProductsService,
//         {
//           provide: getRepositoryToken(ProductEntity),
//           useValue: productRepositoryMock,
//         },
//         {
//           provide: getRepositoryToken(AttributeEntity),
//           useValue: attributeRepositoryMock,
//         },
//         {
//           provide: getRepositoryToken(ProductAttributeEntity),
//           useValue: productAttributeRepositoryMock,
//         },
//         { provide: CategoriesService, useValue: categoryServiceMock },
//         { provide: WarehousesService, useValue: warehouseServiceMock },
//         { provide: PromotionService, useValue: promotionServiceMock }, // Add this line
//       ],
//     }).compile();

//     service = module.get<ProductsService>(ProductsService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should throw a BadRequestException if product name already exists', async () => {
//     jest.spyOn(service, 'findName').mockResolvedValueOnce('Test Product');

//     const createProductAttributeDto: CreateProductAttributeDto = {
//       product: {
//         name: 'Test Product',
//         expiryDay: new Date(),
//         measure: 'kg',
//         categoryId: '381c0edd-ef2e-49dd-81eb-604b114be600',
//         warehouseId: 'b16cfb31-3687-4429-8262-f054fe6ee66e',
//       },
//       attributes: [],
//     };

//     const currentStore: StoreEntity = {
//       id: '0466c77e-6314-4c51-8664-9a4b159237b8',
//       name: 'store 1',
//       typeStore: '1',
//       address: 'asaa',
//       user: null,
//       employees: [],
//       warehouse: [],
//       category: [],
//       products: [],
//       promotions: [],
//       orders: [],
//       vouchers: [],
//     };

//     await expect(
//       service.create(createProductAttributeDto, currentStore),
//     ).rejects.toThrow(BadRequestException);
//   });

//   it('should successfully create a product when the name does not exist', async () => {
//     jest.spyOn(service, 'findName').mockResolvedValueOnce(null);
//     categoryServiceMock.findOne!.mockResolvedValueOnce({});
//     warehouseServiceMock.findById!.mockResolvedValueOnce({ id: 1 });
//     productRepositoryMock.save.mockResolvedValueOnce({ id: 1 });
//     attributeRepositoryMock.save.mockResolvedValueOnce({ id: 1 });

//     const createProductAttributeDto: CreateProductAttributeDto = {
//       product: {
//         name: 'New Product',
//         expiryDay: new Date(),
//         measure: 'kg',
//         categoryId: '381c0edd-ef2e-49dd-81eb-604b114be600',
//         warehouseId: 'b16cfb31-3687-4429-8262-f054fe6ee66e',
//       },
//       attributes: [
//         {
//           key: 'attribute1',
//           description: 'Description of attribute',
//           amount: 10,
//           status: StatusAttibute.HAVE,
//           price: 100,
//         },
//       ],
//     };

//     const currentStore: StoreEntity = {
//       id: '0466c77e-6314-4c51-8664-9a4b159237b8',
//       name: 'store 1',
//       typeStore: '1',
//       address: 'asaa',
//       user: null,
//       employees: [],
//       warehouse: [],
//       category: [],
//       products: [],
//       promotions: [],
//       orders: [],
//       vouchers: [],
//     };

//     const result = await service.create(
//       createProductAttributeDto,
//       currentStore,
//     );

//     expect(result).toBeDefined();
//     expect(productRepositoryMock.save).toHaveBeenCalledTimes(1);
//     expect(attributeRepositoryMock.save).toHaveBeenCalledTimes(1);
//   });
// });
