import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  const listeningPort = 3000;
  await app.listen(listeningPort);
  logger.log(`Solidar API listening on port ${listeningPort}`);
}
bootstrap();
