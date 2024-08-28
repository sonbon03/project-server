import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1724831261155 implements MigrationInterface {
    name = 'UpdateOrder1724831261155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vouchers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "money" numeric(10,2) NOT NULL, "limit_money" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" uuid, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "moneyDiscount" numeric(10,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total" numeric(10,3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_fde2781523f66dfbb7566622000" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_fde2781523f66dfbb7566622000"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "moneyDiscount"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
    }

}
