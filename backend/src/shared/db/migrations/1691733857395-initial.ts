import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1691733857395 implements MigrationInterface {
    name = 'Initial1691733857395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "done" boolean NOT NULL, "favorite" boolean NOT NULL, "order" integer NOT NULL, "note" text NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86a001ae6227a0fe0d8868ae8a" ON "task" ("done") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b612f5a79bc7ea5ab21100e69" ON "task" ("favorite") `);
        await queryRunner.query(`CREATE TABLE "board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b612f5a79bc7ea5ab21100e69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86a001ae6227a0fe0d8868ae8a"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
