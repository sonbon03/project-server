import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePayment1724655961766 implements MigrationInterface {
    name = 'UpdatePayment1724655961766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "amount" TO "total"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "total" TO "amount"`);
    }

}
