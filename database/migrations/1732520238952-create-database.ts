import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1732520238952 implements MigrationInterface {
    name = 'CreateDatabase1732520238952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."attributes_status_enum" AS ENUM('have', 'not')`);
        await queryRunner.query(`CREATE TABLE "attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "status" "public"."attributes_status_enum" NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "price" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_9e227e44c7547d35212ff51e7f" CHECK ("amount" > 0), CONSTRAINT "CHK_1f294d12ce4fb840158df38814" CHECK ("price" > 0), CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid, "productId" uuid, CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" numeric(10,3) NOT NULL, "discount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, "productAttributeId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'unpaid')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentMethod" character varying NOT NULL, "paymentDate" TIMESTAMP NOT NULL, "total" numeric(10,3) NOT NULL, "status" "public"."payments_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantityProduct" integer NOT NULL, "timeBuy" TIMESTAMP NOT NULL, "total" numeric(10,3) NOT NULL, "moneyDiscount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, "employeeId" uuid, "paymentId" uuid, CONSTRAINT "REL_06a051324c76276ca2a9d1feb0" UNIQUE ("paymentId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_gender_enum" AS ENUM('1', '0', '-1')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_roles_enum" AS ENUM('superadmin', 'admin', 'moderator', 'staff', 'customer')`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthday" TIMESTAMP NOT NULL, "gender" "public"."employees_gender_enum" NOT NULL, "phone" character varying NOT NULL, "salary" numeric(10,3) NOT NULL, "point" numeric(10,3) NOT NULL DEFAULT '0', "roles" "public"."employees_roles_enum" NOT NULL, "quantityOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "percentage" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "key" character varying NOT NULL, "startDay" TIMESTAMP NOT NULL, "endDay" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statistics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalProducts" integer NOT NULL, "totalRevenue" numeric(15,2) NOT NULL, "totalDiscount" numeric(15,2) NOT NULL, "totalOrders" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "storeId" uuid, CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vouchers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "money" numeric(10,2) NOT NULL, "limit_money" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('superadmin', 'admin', 'moderator', 'staff', 'customer')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'cancel', 'active')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'admin', "name" character varying NOT NULL, "phone" character varying NOT NULL, "storeId" uuid, "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending', "emailVerificationToken" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listUser" text array NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_db1bfe411e1516c01120b85f8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "typeStore" character varying NOT NULL, "address" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "expiryDay" TIMESTAMP NOT NULL, "manufactureDate" date, "measure" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, "warehouseId" uuid, "promotionId" uuid, "storeId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "limit" integer NOT NULL, "storeId" uuid, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_c0d597555330c0a972122bf4673" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_6f9e5bb97e55359b473e2cef4fd" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_0f82354e5b05fd87884eff3a7b5" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_59fadea46c0451b6663017f4c51" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_06a051324c76276ca2a9d1feb08" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_c2ce9dc929b33c06092de0202a3" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_955ec921e3c5fe579225304aa59" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_fde2781523f66dfbb7566622000" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pool" ADD CONSTRAINT "FK_b0e8bf760013a5a953d5ab59a4d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"`);
        await queryRunner.query(`ALTER TABLE "pool" DROP CONSTRAINT "FK_b0e8bf760013a5a953d5ab59a4d"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_fde2781523f66dfbb7566622000"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_955ec921e3c5fe579225304aa59"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_c2ce9dc929b33c06092de0202a3"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_06a051324c76276ca2a9d1feb08"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_59fadea46c0451b6663017f4c51"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_0f82354e5b05fd87884eff3a7b5"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_6f9e5bb97e55359b473e2cef4fd"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_c0d597555330c0a972122bf4673"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "pool"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TABLE "statistics"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_roles_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_gender_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "product_attribute"`);
        await queryRunner.query(`DROP TABLE "attributes"`);
        await queryRunner.query(`DROP TYPE "public"."attributes_status_enum"`);
    }

}
