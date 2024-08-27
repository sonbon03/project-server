import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployees1724662698862 implements MigrationInterface {
    name = 'UpdateEmployees1724662698862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "point" TYPE numeric(10,3)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "point" TYPE numeric(10,2)`);
    }

}
