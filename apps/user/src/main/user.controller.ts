import { LoginDto, RegisterDto } from '@libs/dtos/user.dto';
import { UUID } from '@libs/types/branded.type';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
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

  @MessagePattern('user.login')
  async handleUserLogin(
    @Payload() dto: LoginDto,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.handleUserLogin(dto, context);
  }

  @MessagePattern('user.logout')
  async handleUserLogout(
    @Payload() sessionId: UUID,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.handleUserLogout(sessionId, context);
  }

  @EventPattern('user.blacklist_detected')
  async handleBlacklistDetected(
    @Payload() userId: UUID,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.handleBlacklistDetected(userId, context);
  }
}
