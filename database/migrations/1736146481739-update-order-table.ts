import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderTable1736146481739 implements MigrationInterface {
    name = 'UpdateOrderTable1736146481739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "storeId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_0f82354e5b05fd87884eff3a7b5" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_0f82354e5b05fd87884eff3a7b5"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "storeId"`);
    }

}
