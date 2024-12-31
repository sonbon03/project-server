import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOndelete1735401549543 implements MigrationInterface {
    name = 'UpdateOndelete1735401549543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4"`);
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761"`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4"`);
        await queryRunner.query(`ALTER TABLE "user_store" DROP CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761"`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e23d978fdb9ea77fe8733f04761" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_store" ADD CONSTRAINT "FK_e519efd75e39df0f0ce466b1aa4" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
