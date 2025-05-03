"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ormconfig_1 = require("./config/ormconfig");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await ormconfig_1.AppDataSource.initialize();
    await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
//# sourceMappingURL=main.js.map