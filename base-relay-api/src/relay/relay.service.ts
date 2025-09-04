import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RelayService {
  private readonly logger = new Logger(RelayService.name);
  private clients = new Map<string, ClientProxy>();

  private getClient(queueName: string): ClientProxy {
    if (!this.clients.has(queueName)) {
      const client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@122.180.30.164:5673'],
          queue: queueName,
          queueOptions: {
            durable: true,
            arguments: {
              'x-message-ttl': 10000,
            },
          },
        },
      });
      this.clients.set(queueName, client);
    }
    return this.clients.get(queueName)!;
  }

  async forwardMessage(message: any) {
    const { target, action, payload } = message;

    if (!target) {
      this.logger.error(`Message missing target: ${JSON.stringify(message)}`);
      return;
    }

    const client = this.getClient(target);
    this.logger.log(`Forwarding command ${action} to  queue: ${target}`);
    return firstValueFrom(client.send({ cmd: action }, message));
  }
}
