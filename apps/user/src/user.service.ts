import { RegisterDto } from '@libs/dtos/user.dto';
import { Injectable } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Injectable()
export class UserService {
  async handleUserRegister(dto: RegisterDto, context: KafkaContext) {
    await this.commitOffsets(context);

    return { value: JSON.stringify(dto) };
  }

  private async commitOffsets(context: KafkaContext) {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
