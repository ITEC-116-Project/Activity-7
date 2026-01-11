import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectStartEndColumns1700000000000
  implements MigrationInterface
{
  name = "AddProjectStartEndColumns1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived. Schema sync via synchronize=true.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op: migration archived.
  }
}
