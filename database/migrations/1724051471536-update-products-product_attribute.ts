import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductsProductAttribute1724051471536 implements MigrationInterface {
    name = 'UpdateProductsProductAttribute1724051471536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_d7897b8dabb2b4884d5c026102e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "productAttributeId"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_c0d597555330c0a972122bf4673" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_c0d597555330c0a972122bf4673"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "productAttributeId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_d7897b8dabb2b4884d5c026102e" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
