import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductAttribute1724744936181 implements MigrationInterface {
    name = 'UpdateProductAttribute1724744936181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "price" TYPE numeric(10,3)`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total" numeric(10,3) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "price" TYPE numeric(10,2)`);
    }

}
