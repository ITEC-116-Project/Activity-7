"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_config_js_1 = require("./config/database.config.js");
const user_crud_module_js_1 = require("./modules/user-crud/user-crud.module.js");
const projects_module_js_1 = require("./modules/projects/projects.module.js");
const tasks_module_js_1 = require("./modules/tasks/tasks.module.js");
const auth_module_js_1 = require("./modules/auth/auth.module.js");
const health_module_js_1 = require("./modules/health/health.module.js");
const skipDb = process.env.SKIP_DB === "1" || process.env.SKIP_DB === "true";
const importsArray = [
    config_1.ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ["env", ".env"],
    }),
];
if (!skipDb) {
    importsArray.push(database_config_js_1.DatabaseConfig);
}
importsArray.push(user_crud_module_js_1.UserCrudModule, projects_module_js_1.ProjectsModule, tasks_module_js_1.TasksModule, auth_module_js_1.AuthModule, health_module_js_1.HealthModule);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: importsArray,
    })
], AppModule);
//# sourceMappingURL=app.module.js.map