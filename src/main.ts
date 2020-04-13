import 'dotenv/config';
import { NestFactory } from '@nestjs/core';

import {Logger} from "@nestjs/common";
import {AppModule} from "./app.module";

const port = process.env.APP_PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log("Serveur started on port" +port)
}
bootstrap();
