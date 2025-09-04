import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@122.180.30.164:5673'],
        queue: '6384a26eeb99ea2bf400d32f', // messages come here first
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
