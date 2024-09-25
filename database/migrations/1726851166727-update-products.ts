import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProducts1726851166727 implements MigrationInterface {
    name = 'UpdateProducts1726851166727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "manufactureDate"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "manufactureDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "manufactureDate"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "manufactureDate" character varying NOT NULL`);
    }

}
