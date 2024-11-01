import { MigrationInterface, QueryRunner } from "typeorm";

export class Statistic1730433781947 implements MigrationInterface {
    name = 'Statistic1730433781947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "statistics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalProducts" integer NOT NULL, "totalRevenue" numeric(15,2) NOT NULL, "totalDiscount" numeric(15,2) NOT NULL, "totalOrders" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "storeId" uuid, CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_3a1a5de9fa19193853909baaaeb"`);
        await queryRunner.query(`DROP TABLE "statistics"`);
    }

}
