import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductAttributeProductsAttributeWarehouse1724050391445
  implements MigrationInterface
{
  name = 'CreateProductAttributeProductsAttributeWarehouse1724050391445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "status" "public"."attributes_status_enum" NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "price" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productAttributesId" uuid, CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "expiryDay" TIMESTAMP NOT NULL, "manufactureDate" character varying NOT NULL, "measure" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, "productAttributeId" uuid, "storeId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "attributes" ADD CONSTRAINT "FK_3d64cd3dfa1e218d6ab58600744" FOREIGN KEY ("productAttributesId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_d7897b8dabb2b4884d5c026102e" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_d7897b8dabb2b4884d5c026102e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attributes" DROP CONSTRAINT "FK_3d64cd3dfa1e218d6ab58600744"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c75e56914ba39ec5dac422ee9d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7898f0f7096c4a6af259ff98b1"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "product_attribute"`);
    await queryRunner.query(`DROP TABLE "attributes"`);
  }
}
