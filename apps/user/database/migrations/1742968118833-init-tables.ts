import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1742968118833 implements MigrationInterface {
  name = 'InitTables1742968118833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                "email" character varying NOT NULL,
                "is_email_verified" boolean NOT NULL DEFAULT false,
                "phone_number" character varying,
                "password" character varying,
                "avatar" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" uuid,
                "updated_by" uuid,
                CONSTRAINT "UQ_user_username" UNIQUE ("username"),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "UQ_user_phone_number" UNIQUE ("phone_number"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "session" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "signature" character varying NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "user_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" uuid,
                "updated_by" uuid,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_session_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_session_user_id_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "session"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
  }
}
