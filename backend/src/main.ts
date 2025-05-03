import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './config/ormconfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppDataSource.initialize();

  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
