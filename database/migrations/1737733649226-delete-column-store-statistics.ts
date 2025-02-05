import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnStoreStatistics1737733649226 implements MigrationInterface {
    name = 'DeleteColumnStoreStatistics1737733649226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP COLUMN "storeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" ADD "storeId" uuid`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
