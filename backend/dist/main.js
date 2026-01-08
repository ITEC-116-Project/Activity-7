"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        console.log("Starting backend...");
        const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
        console.log("DB", {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            name: process.env.DB_NAME,
        });
        app.enableCors({
            origin: ["http://localhost:3000", "http://localhost:5173"],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        const port = Number(process.env.PORT) || 3000;
        await app.listen(port);
        console.log(`Backend started on http://localhost:${port}`);
    }
    catch (err) {
        console.error("Failed to start backend:", err && (err.stack || err));
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map