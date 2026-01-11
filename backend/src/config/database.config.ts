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
  // Enable automatic schema synchronization so new clones migrate schema automatically
  // (migrations removed from project)
  synchronize: true,
  }),
});
