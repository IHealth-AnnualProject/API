import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {Logger, ValidationPipe} from "@nestjs/common";
import {AppModule} from "./app.module";

const port = process.env.APP_PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder().setTitle('BetsBI API')
      .setVersion('1.0')
      .addTag('user')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(port);

  Logger.log("Serveur started on port" +port);
}
bootstrap();
