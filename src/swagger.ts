import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Talkie API')
    .addBearerAuth()
    .setDescription(
      'API for managing the FoodDash food delivery system. It provides endpoints for order management, real-time tracking, user and restaurant management, and other features related to the food delivery process.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    customCssUrl: 'swagger/swagger-theme.css',
    customSiteTitle: 'Talkie API',
    customfavIcon:
      'https://files.joseperezgil.com/images/portfolio/talkie/logo.png',
  });
}
