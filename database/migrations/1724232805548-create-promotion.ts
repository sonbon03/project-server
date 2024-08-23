import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePromotion1724232805548 implements MigrationInterface {
    name = 'CreatePromotion1724232805548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "percentage" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "startDay" TIMESTAMP NOT NULL, "endDay" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD "promotionId" uuid`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_955ec921e3c5fe579225304aa59" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_aa91cfcd035970b18bc9fca2e3e" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_aa91cfcd035970b18bc9fca2e3e"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_955ec921e3c5fe579225304aa59"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP COLUMN "promotionId"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
    }

}
