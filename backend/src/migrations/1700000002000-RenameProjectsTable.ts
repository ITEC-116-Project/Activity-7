import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameProjectsTable1700000002000 implements MigrationInterface {
  name = "RenameProjectsTable1700000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // rename existing `projects` table to `projects_act7` so entity/table name stays in-sync
    await queryRunner.query("ALTER TABLE `projects` RENAME TO `projects_act7`");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert the rename if rolling back
    await queryRunner.query("ALTER TABLE `projects_act7` RENAME TO `projects`");
  }
}
