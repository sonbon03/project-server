import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderProduct1724664300604 implements MigrationInterface {
    name = 'UpdateOrderProduct1724664300604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "amount" integer NOT NULL`);
    }

}
