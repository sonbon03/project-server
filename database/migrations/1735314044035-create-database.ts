import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1735314044035 implements MigrationInterface {
    name = 'CreateDatabase1735314044035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "message" character varying NOT NULL, "timePool" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f11d13c5140e3fca39630df620" ON "notification" ("timePool") `);
        await queryRunner.query(`CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "percentage" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "key" character varying NOT NULL, "startDay" TIMESTAMP NOT NULL, "endDay" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statistics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalProducts" integer NOT NULL, "totalRevenue" numeric(15,2) NOT NULL, "totalDiscount" numeric(15,2) NOT NULL, "totalOrders" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "storeId" uuid, CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listStores" text array NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_db1bfe411e1516c01120b85f8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a0598382ebe775567010f85fa6" ON "pool" ("listStores", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying, "password" character varying, "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'admin', "last_name" character varying, "first_name" character varying NOT NULL, "phone" character varying NOT NULL, "point" character varying DEFAULT '0', "salary" character varying, "quantityOrder" integer DEFAULT '0', "gender" character varying, "status" "public"."users_status_enum" DEFAULT 'pending', "emailVerificationToken" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "storeId" uuid NOT NULL, "adminId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b7eefd81e97f9a779785f66080" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vouchers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "money" numeric(10,2) NOT NULL, "limit_money" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "typeStore" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentMethod" character varying NOT NULL, "paymentDate" TIMESTAMP NOT NULL, "total" numeric(10,3) NOT NULL, "status" "public"."payments_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "storeId" uuid NOT NULL, "point" numeric(10,2) NOT NULL DEFAULT '0', "quantityOrder" character varying NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_113af29e63e0f05e99791c72ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantityProduct" integer NOT NULL, "timeBuy" TIMESTAMP NOT NULL, "name" character varying NOT NULL, "total" numeric(10,3) NOT NULL, "moneyDiscount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeCustomerId" uuid, "paymentId" uuid, CONSTRAINT "REL_06a051324c76276ca2a9d1feb0" UNIQUE ("paymentId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" numeric(10,3) NOT NULL, "discount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, "productAttributeId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "status" "public"."attributes_status_enum" NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "expiryDay" TIMESTAMP NOT NULL, "manufactureDate" date, "price" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_9e227e44c7547d35212ff51e7f" CHECK ("amount" > 0), CONSTRAINT "CHK_1f294d12ce4fb840158df38814" CHECK ("price" > 0), CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid, "productId" uuid, CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "importDay" TIMESTAMP NOT NULL, "measure" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, "warehouseId" uuid, "promotionId" uuid, "storeId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "limit" integer NOT NULL, "storeId" uuid, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_e0b91b88a0ec9cdf815e28ba1d1" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_955ec921e3c5fe579225304aa59" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pool" ADD CONSTRAINT "FK_37785a2671efefff7d6fb0387f1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_fde2781523f66dfbb7566622000" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_customer" ADD CONSTRAINT "FK_ffa9496782557424c3321906d51" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_customer" ADD CONSTRAINT "FK_0e8eee52ea177410b05c7b51dc4" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b5ea6e5f567c1587a757c9ed0f0" FOREIGN KEY ("storeCustomerId") REFERENCES "store_customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_06a051324c76276ca2a9d1feb08" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_6f9e5bb97e55359b473e2cef4fd" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_c0d597555330c0a972122bf4673" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_2e593d5836b65fc8f8056b364fe" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_5e39540b1cb0cac2f77e51fe69f" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_f5aff4026a81fc0b35219edf512" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_f5aff4026a81fc0b35219edf512"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_5e39540b1cb0cac2f77e51fe69f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_2e593d5836b65fc8f8056b364fe"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_c0d597555330c0a972122bf4673"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_6f9e5bb97e55359b473e2cef4fd"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_06a051324c76276ca2a9d1feb08"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b5ea6e5f567c1587a757c9ed0f0"`);
        await queryRunner.query(`ALTER TABLE "store_customer" DROP CONSTRAINT "FK_0e8eee52ea177410b05c7b51dc4"`);
        await queryRunner.query(`ALTER TABLE "store_customer" DROP CONSTRAINT "FK_ffa9496782557424c3321906d51"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_fde2781523f66dfbb7566622000"`);
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4"`);
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761"`);
        await queryRunner.query(`ALTER TABLE "pool" DROP CONSTRAINT "FK_37785a2671efefff7d6fb0387f1"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_955ec921e3c5fe579225304aa59"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_e0b91b88a0ec9cdf815e28ba1d1"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_attribute"`);
        await queryRunner.query(`DROP TABLE "attributes"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "store_customer"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TABLE "user_store"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0598382ebe775567010f85fa6"`);
        await queryRunner.query(`DROP TABLE "pool"`);
        await queryRunner.query(`DROP TABLE "statistics"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f11d13c5140e3fca39630df620"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
