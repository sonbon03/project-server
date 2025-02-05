import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnImageForAttribute1738724683858 implements MigrationInterface {
    name = 'AddColumnImageForAttribute1738724683858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attributes" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attributes" DROP COLUMN "image"`);
    }

}
