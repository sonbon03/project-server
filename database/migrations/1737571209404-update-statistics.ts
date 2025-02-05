import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatistics1737571209404 implements MigrationInterface {
    name = 'UpdateStatistics1737571209404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" ADD "totalProfit" numeric(15,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" DROP COLUMN "totalProfit"`);
    }

}
