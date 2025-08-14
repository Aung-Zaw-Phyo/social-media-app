import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({whitelist: true})
  );
  app.useLogger(app.get(Logger));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Social Media App API')
    .setDescription(`
      Secure user authentication with refresh token system.
      Users can create, read, and delete posts, 
      as well as like or unlike them and leave comments. 
      The API provides search and pagination functionalities to find posts by keywords in their content. 
      Each post response includes the total number of likes, whether the current user has liked it, 
      and whether the current user has commented on it, enabling an interactive user experience.
    `)
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
  await app.listen(app.get(ConfigService).get('PORT') ?? 3000);
}
bootstrap();
