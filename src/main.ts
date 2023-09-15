import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The useGlobalPipes() method is used to enable the ValidationPipe globally.
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(8000);
}
bootstrap();
