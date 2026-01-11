import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameProjectsTable1700000002000 implements MigrationInterface {
  name = "RenameProjectsTable1700000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived. Schema now handled by synchronize=true.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived.
  }
}
