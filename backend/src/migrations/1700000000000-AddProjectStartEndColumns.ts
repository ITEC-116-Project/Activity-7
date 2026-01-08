import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectStartEndColumns1700000000000
  implements MigrationInterface
{
  name = "AddProjectStartEndColumns1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add nullable datetime columns for startDate and endDate to projects
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD COLUMN \`startDate\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD COLUMN \`endDate\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`endDate\``);
    await queryRunner.query(
      `ALTER TABLE \`projects\` DROP COLUMN \`startDate\``,
    );
  }
}
