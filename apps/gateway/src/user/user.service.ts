import { RegisterDto } from '@libs/dtos/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.userClient.subscribeToResponseOf('user.register');
  }

  async register(dto: RegisterDto) {
    const observable = this.userClient.send<RegisterDto>('user.register', {
      value: JSON.stringify(dto),
    });

    return await firstValueFrom(observable);
  }
}
