import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const listeningPort = configService.get('API_PORT');
  await app.listen(listeningPort);
  logger.log(`Solidar API listening on port ${listeningPort}`);
}
bootstrap();
