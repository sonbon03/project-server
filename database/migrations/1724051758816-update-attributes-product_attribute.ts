import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAttributesProductAttribute1724051758816 implements MigrationInterface {
    name = 'UpdateAttributesProductAttribute1724051758816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attributes" DROP CONSTRAINT "FK_3d64cd3dfa1e218d6ab58600744"`);
        await queryRunner.query(`ALTER TABLE "attributes" DROP COLUMN "productAttributesId"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD "attributeId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_5134aa627db96cdfb1bf0be5223"`);
        await queryRunner.query(`ALTER TABLE "product_attribute" DROP COLUMN "attributeId"`);
        await queryRunner.query(`ALTER TABLE "attributes" ADD "productAttributesId" uuid`);
        await queryRunner.query(`ALTER TABLE "attributes" ADD CONSTRAINT "FK_3d64cd3dfa1e218d6ab58600744" FOREIGN KEY ("productAttributesId") REFERENCES "product_attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
