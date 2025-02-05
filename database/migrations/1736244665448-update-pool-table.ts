import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePoolTable1736244665448 implements MigrationInterface {
    name = 'UpdatePoolTable1736244665448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pool" DROP CONSTRAINT "FK_37785a2671efefff7d6fb0387f1"`);
        await queryRunner.query(`ALTER TABLE "pool" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pool" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "pool" ADD CONSTRAINT "FK_37785a2671efefff7d6fb0387f1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
