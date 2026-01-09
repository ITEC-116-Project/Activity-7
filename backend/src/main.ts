import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  try {
    console.log("Starting backend...");
    const app = await NestFactory.create(AppModule);
    // log DB env values (not password) to help diagnose connection issues

    console.log("DB", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      name: process.env.DB_NAME,
    });
    app.enableCors({
      origin: ["http://localhost:3000", "http://localhost:5173"], // React frontend (vite)
    });

    // enable validation for DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // configure swagger documentation at /docs for quick endpoint inspection
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Activity 7 API")
      .setDescription("Interactive documentation for the Activity 7 backend")
      .setVersion(process.env.npm_package_version ?? "1.0.0")
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup("docs", app, swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port);
    console.log(`Backend started on http://localhost:${port}`);
  } catch (err) {
    // Log startup errors clearly so you can paste them here for diagnosis
    // Common causes: DB connection refused, missing env variables

    console.error("Failed to start backend:", err && (err.stack || err));
    process.exit(1);
  }
}
bootstrap();
