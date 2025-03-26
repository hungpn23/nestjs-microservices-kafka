import { IS_PUBLIC, IS_REFRESH_TOKEN } from '@libs/constants/metadata.const';
import { JwtPayload, RefreshPayload } from '@libs/types/jwt.type';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { Request as ExpressRequest } from 'express';
import { AuthEnvVariables } from './configs/auth.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authConfig: ConfigService<AuthEnvVariables, true>,
    private readonly jwtService: JwtService,
    @Inject('USER_CLIENT') private readonly userClient: ClientKafka,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;

    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_TOKEN,
      [context.getClass(), context.getHandler()],
    );

    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (isRefreshToken) {
      const refreshToken = this.extractTokenFromHeader(request);
      request['user'] = this.verifyRefreshToken(refreshToken);

      return true;
    }

    const accessToken = this.extractTokenFromHeader(request);
    request['user'] = await this.verifyAccessToken(accessToken);

    return true;
  }

  private async verifyAccessToken(accessToken: string): Promise<JwtPayload> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.authConfig.get('JWT_SECRET', { infer: true }),
      });
    } catch (_error) {
      throw new UnauthorizedException();
    }

    const { userId, sessionId } = payload;
    const isBlacklisted = await this.cacheManager.get<boolean>(
      `SESSION_BLACKLIST:${userId}:${sessionId}`,
    );

    if (isBlacklisted) {
      this.userClient.emit('user.blacklist_detected', {
        value: userId,
      });

      throw new UnauthorizedException('blacklist detected');
    }

    return payload;
  }

  private async verifyRefreshToken(refreshToken: string) {
    let payload: RefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.authConfig.get('REFRESH_SECRET', { infer: true }),
      });
    } catch (_error) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  private extractTokenFromHeader(request: ExpressRequest) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
