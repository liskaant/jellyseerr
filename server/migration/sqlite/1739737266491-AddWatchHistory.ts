import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWatchHistory1739737266491 implements MigrationInterface {
  name = 'AddWatchHistory1739737266491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "showTmdbId" integer, "seasonNumber" integer NOT NULL, "episodeNumberStart" integer NOT NULL, "episodeNumberEnd" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "seasonId" integer, CONSTRAINT "FK_e73d28c1e5e3c85125163f7c9cd" FOREIGN KEY ("seasonId") REFERENCES "season" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_925f5db9455ae39f4ce690aa06" ON "episode" ("showTmdbId", "seasonNumber", "episodeNumberStart", "episodeNumberEnd") `
    );
    await queryRunner.query(
      `CREATE TABLE "watch_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "watchProgress" decimal(3) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "mediaId" integer, "seasonId" integer, "episodeId" integer, CONSTRAINT "FK_f287ef6180d95d3bdae3916c968" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_70e826c71cbd3eb5f0fb73080eb" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f2e4ce40398559c69946fbc1460" FOREIGN KEY ("seasonId") REFERENCES "season" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fa3c6029fd6daa879d961c2fa27" FOREIGN KEY ("episodeId") REFERENCES "episode" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(`ALTER TABLE "season" ADD "showTmdbId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "showTmdbId"`);
    await queryRunner.query(`DROP TABLE "watch_history"`);
    await queryRunner.query(`DROP INDEX "IDX_925f5db9455ae39f4ce690aa06"`);
    await queryRunner.query(`DROP TABLE "episode"`);
  }
}
