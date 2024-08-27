import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderProduct1724664993932 implements MigrationInterface {
    name = 'UpdateOrderProduct1724664993932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "price" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "price" integer NOT NULL`);
    }

}
