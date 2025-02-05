import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAttribute1737563684724 implements MigrationInterface {
    name = 'UpdateAttribute1737563684724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attributes" ADD "priceImport" numeric(10,3)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attributes" DROP COLUMN "priceImport"`);
    }

}
