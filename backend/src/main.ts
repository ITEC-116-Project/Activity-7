import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";

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
