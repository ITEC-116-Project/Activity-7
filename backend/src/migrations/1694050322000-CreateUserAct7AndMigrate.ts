import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAct7AndMigrate1694050322000
  implements MigrationInterface
{
  name = "CreateUserAct7AndMigrate1694050322000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // No-op: this migration has been archived. Schema is managed with synchronize=true now.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op for down migration as this migration is archived.
  }
}
