import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnStoreIdStatistics1738143280086 implements MigrationInterface {
    name = 'UpdateColumnStoreIdStatistics1738143280086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" ADD "storeId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" DROP COLUMN "storeId"`);
    }

}
