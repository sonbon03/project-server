import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductAttributePayment1724745201812 implements MigrationInterface {
    name = 'UpdateProductAttributePayment1724745201812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total" numeric(10,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "price" TYPE numeric(10,3)`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
