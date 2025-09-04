import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RelayService } from './relay/relay.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RelayService],
})
export class AppModule {}
