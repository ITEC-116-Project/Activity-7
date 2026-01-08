import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfig } from "./config/database.config.js";
import { UserCrudModule } from "./modules/user-crud/user-crud.module.js";
import { ProjectsModule } from "./modules/projects/projects.module.js";
import { TasksModule } from "./modules/tasks/tasks.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { HealthModule } from "./modules/health/health.module.js";

const skipDb = process.env.SKIP_DB === "1" || process.env.SKIP_DB === "true";

const importsArray: any[] = [
  // ✅ Load environment variables
  // Try both 'env' (project file) and '.env' so local setup is accepted
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ["env", ".env"],
  }),
];

// only try to connect to DB when SKIP_DB is not set
if (!skipDb) {
  importsArray.push(DatabaseConfig);
}

importsArray.push(
  UserCrudModule,
  ProjectsModule,
  TasksModule,
  AuthModule,
  HealthModule,
);

@Module({
  imports: importsArray,
})
export class AppModule {}
