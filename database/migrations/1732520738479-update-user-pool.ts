import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPool1732520738479 implements MigrationInterface {
    name = 'UpdateUserPool1732520738479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pool" DROP CONSTRAINT "FK_b0e8bf760013a5a953d5ab59a4d"`);
        await queryRunner.query(`ALTER TABLE "pool" RENAME COLUMN "storeId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "pool" ADD CONSTRAINT "FK_37785a2671efefff7d6fb0387f1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pool" DROP CONSTRAINT "FK_37785a2671efefff7d6fb0387f1"`);
        await queryRunner.query(`ALTER TABLE "pool" RENAME COLUMN "userId" TO "storeId"`);
        await queryRunner.query(`ALTER TABLE "pool" ADD CONSTRAINT "FK_b0e8bf760013a5a953d5ab59a4d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
