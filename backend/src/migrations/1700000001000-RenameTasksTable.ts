import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTasksTable1700000001000 implements MigrationInterface {
  name = "RenameTasksTable1700000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // rename existing `tasks` table to `tasks_act7` so entity/table name stays in-sync
    await queryRunner.query("ALTER TABLE `tasks` RENAME TO `tasks_act7`");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert the rename if rolling back
    await queryRunner.query("ALTER TABLE `tasks_act7` RENAME TO `tasks`");
  }
}
