import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStoresUsers1725010467377 implements MigrationInterface {
    name = 'UpdateStoresUsers1725010467377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."stores_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'cancel', 'active')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."stores_status_enum" AS ENUM('pending', 'cancel', 'active')`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "status" "public"."stores_status_enum" NOT NULL DEFAULT 'pending'`);
    }

}
