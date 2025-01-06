import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUniqueNameOrder1736139661543 implements MigrationInterface {
    name = 'UpdateUniqueNameOrder1736139661543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "UQ_3c523f65ce114eecf052cf6cd25" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "UQ_3c523f65ce114eecf052cf6cd25"`);
    }

}
