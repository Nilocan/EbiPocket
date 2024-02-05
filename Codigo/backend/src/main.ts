import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const origin = process.env.FRONTEND_URL;

  app.enableCors({
    origin: [origin],
  });
  await app.listen(5001);
}
bootstrap();
