import { LoginDto, RegisterDto, TokenPair } from '@libs/dtos/user.dto';
import { Milliseconds } from '@libs/types/branded.type';
import { JwtPayload } from '@libs/types/jwt.type';
import { ReplyStatus } from '@libs/types/kafka.type';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.userClient.subscribeToResponseOf('user.register');
    this.userClient.subscribeToResponseOf('user.login');
    this.userClient.subscribeToResponseOf('user.logout');
  }

  async register(dto: RegisterDto) {
    const observable = this.userClient.send<TokenPair>('user.register', {
      value: JSON.stringify(dto),
    });

    return await firstValueFrom(observable);
  }

  async login(dto: LoginDto) {
    const observable = this.userClient.send<TokenPair>('user.login', {
      value: JSON.stringify(dto),
    });

    return await firstValueFrom(observable);
  }

  async logout(payload: JwtPayload) {
    const ttl = (payload.exp! * 1000 - Date.now()) as Milliseconds;
    await this.cacheManager.set<boolean>(
      `SESSION_BLACKLIST:${payload.userId}:${payload.sessionId}`,
      true,
      ttl,
    );

    const observable = this.userClient.send<ReplyStatus>('user.logout', {
      value: payload.sessionId,
    });

    return await firstValueFrom(observable);
  }
}
