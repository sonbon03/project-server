import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductStore1723718639580 implements MigrationInterface {
  name = 'UpdateProductStore1723718639580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "storeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "storeId"`);
  }
}
