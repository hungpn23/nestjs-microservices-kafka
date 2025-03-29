import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationTables1743258902769 implements MigrationInterface {
  name = 'AddLocationTables1743258902769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "province" (
                "code" integer NOT NULL,
                "name" character varying NOT NULL,
                "codename" character varying NOT NULL,
                CONSTRAINT "PK_province_code" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "district" (
                "code" integer NOT NULL,
                "name" character varying NOT NULL,
                "codename" character varying NOT NULL,
                "province_code" integer,
                CONSTRAINT "PK_district_code" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ward" (
                "code" integer NOT NULL,
                "name" character varying NOT NULL,
                "codename" character varying NOT NULL,
                "district_code" integer,
                CONSTRAINT "PK_ward_code" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "address" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "receiver_name" character varying NOT NULL,
                "phone_number" character varying NOT NULL,
                "detail" character varying NOT NULL,
                "user_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" uuid,
                "updated_by" uuid,
                CONSTRAINT "PK_address_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "district"
            ADD CONSTRAINT "FK_district_province_code_province_code" FOREIGN KEY ("province_code") REFERENCES "province"("code") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ward"
            ADD CONSTRAINT "FK_ward_district_code_district_code" FOREIGN KEY ("district_code") REFERENCES "district"("code") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "address"
            ADD CONSTRAINT "FK_address_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "address" DROP CONSTRAINT "FK_address_user_id_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "ward" DROP CONSTRAINT "FK_ward_district_code_district_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "district" DROP CONSTRAINT "FK_district_province_code_province_code"
        `);
    await queryRunner.query(`
            DROP TABLE "address"
        `);
    await queryRunner.query(`
            DROP TABLE "ward"
        `);
    await queryRunner.query(`
            DROP TABLE "district"
        `);
    await queryRunner.query(`
            DROP TABLE "province"
        `);
  }
}
