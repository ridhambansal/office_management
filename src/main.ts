import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: socketio.ServerOptions): socketio.Server {
    const server = super.createIOServer(port, options);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('OfficeSpaceZ application')
    .setDescription('Swagger Documentation for OfficeSpaceZ app implementation')
    .setVersion('1.0')
    // .addTag('back to office prisma')
    .addBearerAuth(
      {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'access-token'
    )
    .build();
  app.useWebSocketAdapter(new SocketIoAdapter(app))
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(process.env.PORT || 8080);
}
bootstrap();