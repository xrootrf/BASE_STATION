import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@192.168.2.100:5673'],
        queue: '644f87e4c34fc2d39fbd50d7', // messages come here first
        queueOptions: {
          durable: true,
          arguments: {
            'x-message-ttl': 10000,
          },
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
