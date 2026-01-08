import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAct7AndMigrate1694050322000
  implements MigrationInterface
{
  name = "CreateUserAct7AndMigrate1694050322000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // create new table user_act7 if not exists
    await queryRunner.query(`
					CREATE TABLE IF NOT EXISTS \`user_act7\` (
						\`id\` int NOT NULL AUTO_INCREMENT,
				\`name\` varchar(255) NOT NULL,
				\`username\` varchar(255) NOT NULL,
				\`email\` varchar(255) NOT NULL,
				\`password\` varchar(255) NOT NULL,
				\`companyId\` varchar(255) DEFAULT NULL,
				\`role\` enum('manager','member') NOT NULL DEFAULT 'member',
				\`department\` enum('Admin','HR','IT','Sales','Finance') DEFAULT NULL,
				\`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY (\`id\`),
				UNIQUE KEY \`IDX_user_act7_username\` (\`username\`),
				UNIQUE KEY \`IDX_user_act7_email\` (\`email\`)
			) ENGINE=InnoDB;
		`);

    // copy existing users into user_act7 preserving ids when possible
    // set username to email if available, otherwise to 'user'+id
    await queryRunner.query(`
			INSERT INTO \`user_act7\` (id, name, username, email, password, companyId, role, department, createdAt)
			SELECT u.id, u.name, COALESCE(u.email, CONCAT('user', u.id)), COALESCE(u.email, ''), u.password, NULL, 'member', NULL, u.createdAt
			FROM \`users\` u
			WHERE u.id NOT IN (SELECT id FROM \`user_act7\`)
		`);

    // Insert placeholder users for any ownerId in projects (projects will be renamed to projects_act7 by a later migration) that are missing from user_act7
    await queryRunner.query(
      "INSERT INTO user_act7 (id, name, username, email, password, companyId, role, department, createdAt)\n" +
        "SELECT DISTINCT p.ownerId as id,\n" +
        "  CONCAT('Migrated User ', p.ownerId) as name,\n" +
        "  CONCAT('migrated', p.ownerId) as username,\n" +
        "  CONCAT('migrated', p.ownerId, '@local') as email,\n" +
        "  'migrated' as password,\n" +
        "  NULL as companyId,\n" +
        "  'member' as role,\n" +
        "  NULL as department,\n" +
        "  NOW() as createdAt\n" +
        "FROM projects p\n" +
        "LEFT JOIN user_act7 ua ON p.ownerId = ua.id\n" +
        "WHERE p.ownerId IS NOT NULL AND ua.id IS NULL;",
    );

    // Insert placeholder users for any assignedToId in tasks (will be renamed to tasks_act7 by a later migration) that are missing from user_act7
    await queryRunner.query(
      "INSERT INTO user_act7 (id, name, username, email, password, companyId, role, department, createdAt)\n" +
        "SELECT DISTINCT t.assignedToId as id,\n" +
        "  CONCAT('Migrated User ', t.assignedToId) as name,\n" +
        "  CONCAT('migrated', t.assignedToId) as username,\n" +
        "  CONCAT('migrated', t.assignedToId, '@local') as email,\n" +
        "  'migrated' as password,\n" +
        "  NULL as companyId,\n" +
        "  'member' as role,\n" +
        "  NULL as department,\n" +
        "  NOW() as createdAt\n" +
        "FROM tasks t\n" +
        "LEFT JOIN user_act7 ua ON t.assignedToId = ua.id\n" +
        "WHERE t.assignedToId IS NOT NULL AND ua.id IS NULL;",
    );

    // Null any orphan ownerId/assignedToId values that would violate new foreign keys
    await queryRunner.query(`
			UPDATE \`projects\` p
			LEFT JOIN \`user_act7\` ua ON p.ownerId = ua.id
			SET p.ownerId = NULL
			WHERE p.ownerId IS NOT NULL AND ua.id IS NULL;
		`);
    await queryRunner.query(`
			UPDATE \`tasks\` t
			LEFT JOIN \`user_act7\` ua ON t.assignedToId = ua.id
			SET t.assignedToId = NULL
			WHERE t.assignedToId IS NOT NULL AND ua.id IS NULL;
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // don't delete migrated data from user_act7 to be safe; just drop the table if needed
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_act7\``);
  }
}
