import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductsWarehouse1724051069547 implements MigrationInterface {
    name = 'UpdateProductsWarehouse1724051069547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_37844f2e58909766d936c1c693e"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "productsId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "warehouseId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_2e593d5836b65fc8f8056b364fe" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_2e593d5836b65fc8f8056b364fe"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "warehouseId"`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "productsId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_37844f2e58909766d936c1c693e" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
