import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTasksTable1700000001000 implements MigrationInterface {
  name = "RenameTasksTable1700000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived. Schema now handled by synchronize=true.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived.
  }
}
