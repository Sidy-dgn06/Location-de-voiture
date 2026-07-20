import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({ origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:5173'], credentials: true });
  app.enableShutdownHooks();
  await app.listen(4000);
  console.log('Backend démarré sur http://localhost:4000');
}
bootstrap();
