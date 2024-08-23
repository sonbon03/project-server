import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductsWarehouse1724050632990 implements MigrationInterface {
    name = 'UpdateProductsWarehouse1724050632990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "productsId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_37844f2e58909766d936c1c693e" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_37844f2e58909766d936c1c693e"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "productsId"`);
    }

}
