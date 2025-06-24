import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws'
import * as bodyParser from 'body-parser';

async function bootstrap() {

  if (process.env.NODE_ENV === 'development') {
    console.log('Lancement en mode développement 🚀');
  } else {
    console.log('Lancement en mode production 🔥');
  }

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  app.enableCors({
    origin: process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : process.env.FRONTEND_URL,
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, }));
  //app.useWebSocketAdapter(new WsAdapter(app))

  await app.listen(PORT);
  console.log('app listening on PORT : ', PORT)

}

bootstrap();