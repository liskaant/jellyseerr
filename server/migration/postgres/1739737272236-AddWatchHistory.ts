import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWatchHistory1739737272236 implements MigrationInterface {
  name = 'AddWatchHistory1739737272236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode" ("id" SERIAL NOT NULL, "showTmdbId" integer, "seasonNumber" integer NOT NULL, "episodeNumberStart" integer NOT NULL, "episodeNumberEnd" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "seasonId" integer, CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_925f5db9455ae39f4ce690aa06" ON "episode" ("showTmdbId", "seasonNumber", "episodeNumberStart", "episodeNumberEnd") `
    );
    await queryRunner.query(
      `CREATE TABLE "watch_history" ("id" SERIAL NOT NULL, "source" character varying NOT NULL, "watchProgress" numeric(3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "mediaId" integer, "seasonId" integer, "episodeId" integer, CONSTRAINT "PK_4a7d6381618ede4bcde39b5a708" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "season" ADD "showTmdbId" integer`);
    await queryRunner.query(
      `ALTER TABLE "episode" ADD CONSTRAINT "FK_e73d28c1e5e3c85125163f7c9cd" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" ADD CONSTRAINT "FK_f287ef6180d95d3bdae3916c968" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" ADD CONSTRAINT "FK_70e826c71cbd3eb5f0fb73080eb" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" ADD CONSTRAINT "FK_f2e4ce40398559c69946fbc1460" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" ADD CONSTRAINT "FK_fa3c6029fd6daa879d961c2fa27" FOREIGN KEY ("episodeId") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watch_history" DROP CONSTRAINT "FK_fa3c6029fd6daa879d961c2fa27"`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" DROP CONSTRAINT "FK_f2e4ce40398559c69946fbc1460"`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" DROP CONSTRAINT "FK_70e826c71cbd3eb5f0fb73080eb"`
    );
    await queryRunner.query(
      `ALTER TABLE "watch_history" DROP CONSTRAINT "FK_f287ef6180d95d3bdae3916c968"`
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP CONSTRAINT "FK_e73d28c1e5e3c85125163f7c9cd"`
    );
    await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "showTmdbId"`);
    await queryRunner.query(`DROP TABLE "watch_history"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_925f5db9455ae39f4ce690aa06"`
    );
    await queryRunner.query(`DROP TABLE "episode"`);
  }
}
