import { RegisterDto } from '@libs/dtos/user.dto';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.register')
  async handleUserRegister(
    @Payload() dto: RegisterDto,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.handleUserRegister(dto, context);
  }
}
