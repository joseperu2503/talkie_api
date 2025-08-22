import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Talkie API')
    .addBearerAuth()
    .setDescription(
      'API for real-time chat messaging application. It provides endpoints for user authentication, contact management, instant messaging with WebSocket support, push notifications, and secure communication features.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    customCssUrl: 'swagger/swagger-theme.css',
    customSiteTitle: 'Talkie API',
    customfavIcon: 'swagger/favicon.svg',
  });
}
