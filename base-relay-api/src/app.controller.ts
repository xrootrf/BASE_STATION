import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RelayService } from './relay/relay.service';

@Controller()
export class AppController {
  constructor(private readonly relayService: RelayService) {}

  @MessagePattern({ cmd: 'uploadmission' })
  async handleUploadMissionRelay(@Payload() message: any) {
    console.log(message);
    const value = await this.relayService.forwardMessage(message);
    return value;
  }

  @MessagePattern({ cmd: 'startmission' })
  async handleUploadMissionAndTakeOffRelay(@Payload() message: any) {
    const value = await this.relayService.forwardMessage(message);
    return value;
  }

  @MessagePattern({ cmd: 'hold' })
  async holdRelay(@Payload() message: any) {
    const value = await this.relayService.forwardMessage(message);
    return value;
  }

  @MessagePattern({ cmd: 'arm' })
  async armRelay(@Payload() message: any) {
    const value = await this.relayService.forwardMessage(message);
    return value;
  }

  @MessagePattern({ cmd: 'rtl' })
  async rtlRelay(@Payload() message: any) {
    const value = await this.relayService.forwardMessage(message);
    return value;
  }

  @MessagePattern({ cmd: 'land' })
  async landRelay(@Payload() message: any) {
    const value = await this.relayService.forwardMessage(message);
    return value;
  }


  @MessagePattern({ cmd: 'movedrone' })
  async moveDroneRelay(@Payload() message: any) {
    const value = await this.relayService.emitForwardMessage(message);
    return value;
  }
}
