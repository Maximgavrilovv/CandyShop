import { MigrationInterface, QueryRunner } from 'typeorm';
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" ("id" UUID NOT NULL DEFAULT gen_random_uuid(),"email" VARCHAR NOT NULL,"password" VARCHAR NOT NULL,"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),CONSTRAINT "PK_users" PRIMARY KEY ("id"),CONSTRAINT "UQ_users_email" UNIQUE ("email"))`);
    await queryRunner.query(`CREATE TABLE "candies" ("id" UUID NOT NULL DEFAULT gen_random_uuid(),"name" VARCHAR NOT NULL,"flavour" VARCHAR NOT NULL,"description" TEXT NOT NULL,"stock" INTEGER NOT NULL DEFAULT 0,"available" BOOLEAN NOT NULL DEFAULT true,"weight" INTEGER NOT NULL,"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),"updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),CONSTRAINT "PK_candies" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "cart_items" ("id" UUID NOT NULL DEFAULT gen_random_uuid(),"user_id" UUID NOT NULL,"candy_id" UUID NOT NULL,"quantity" INTEGER NOT NULL DEFAULT 1,"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),CONSTRAINT "PK_cart_items" PRIMARY KEY ("id"),CONSTRAINT "UQ_cart_user_candy" UNIQUE ("user_id","candy_id"),CONSTRAINT "FK_cart_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,CONSTRAINT "FK_cart_candy" FOREIGN KEY ("candy_id") REFERENCES "candies"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE "orders" ("id" UUID NOT NULL DEFAULT gen_random_uuid(),"user_id" UUID,"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),CONSTRAINT "PK_orders" PRIMARY KEY ("id"),CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE "order_items" ("id" UUID NOT NULL DEFAULT gen_random_uuid(),"order_id" UUID NOT NULL,"candy_id" UUID,"candy_name" VARCHAR NOT NULL,"quantity" INTEGER NOT NULL,CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),CONSTRAINT "FK_oi_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,CONSTRAINT "FK_oi_candy" FOREIGN KEY ("candy_id") REFERENCES "candies"("id") ON DELETE SET NULL)`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "candies"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
