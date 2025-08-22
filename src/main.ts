import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { initializeFirebaseApp } from './firebase.config';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  initializeFirebaseApp();

  app.useStaticAssets(join(__dirname, '..', 'public'));

  setupSwagger(app);

  await app.listen(parseInt(process.env.SERVER_PORT || '3000'));
}
bootstrap();
