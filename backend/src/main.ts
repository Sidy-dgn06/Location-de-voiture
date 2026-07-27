import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({ origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:5173'], credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Location de Voitures API')
    .setDescription('API pour la plateforme de location de voitures')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);
  console.log(`Backend démarré sur http://localhost:${port}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${port}/docs`);
}
bootstrap();
