import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AllEntities } from "src/typeorm/all-entities";

export const DatabaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: "mysql",
    host: config.get<string>("DB_HOST"),
    port: Number(config.get<string>("DB_PORT")),
    username: config.get<string>("DB_USER"),
    password: config.get<string>("DB_PASS"),
    database: config.get<string>("DB_NAME"),
    entities: AllEntities,
    // Use migrations in place of automatic schema sync to control changes and data migrations
    synchronize: false,
    migrationsRun: true,
    migrations: [__dirname + "/../migrations/*.{ts,js}"],
  }),
});
