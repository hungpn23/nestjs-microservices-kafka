import { RegisterDto } from '@libs/dtos/user.dto';
import { Seconds } from '@libs/types/branded.type';
import { JwtPayload, RefreshPayload } from '@libs/types/jwt.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { KafkaContext } from '@nestjs/microservices';
import { AuthEnvVariables } from '@user/configs/auth.config';
import argon2 from 'argon2';
import ms from 'ms';
import crypto from 'node:crypto';
import { SessionEntity } from './entities/session.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfig: ConfigService<AuthEnvVariables, true>,
  ) {}

  async handleUserRegister(
    { username, email, password }: RegisterDto,
    context: KafkaContext,
  ) {
    try {
      const found = await UserEntity.findOne({
        where: [{ username }, { email }],
      });

      if (found) throw new Error('username or email already exists');

      const user = await UserEntity.save(
        new UserEntity({
          username,
          email,
          password: await argon2.hash(password),
        }),
      );

      const tokenPair = await this.createTokenPair(user);
      return { value: JSON.stringify(tokenPair) };
    } finally {
      await this.commitOffsets(context);
    }
  }

  private async createAccessToken(payload: JwtPayload): Promise<string> {
    const expiresIn = this.authConfig.get('JWT_TOKEN_EXPIRES_IN', {
      infer: true,
    });

    return await this.jwtService.signAsync(payload, {
      secret: this.authConfig.get('JWT_SECRET', { infer: true }),
      expiresIn: (ms(expiresIn) / 1000) as Seconds,
    });
  }

  private async createRefreshToken(
    payload: RefreshPayload,
    expiresIn: Seconds,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.authConfig.get('REFRESH_SECRET', { infer: true }),
      expiresIn,
    });
  }

  private async createTokenPair(user: UserEntity) {
    const sessionExpiresIn = this.authConfig.get('REFRESH_TOKEN_EXPIRES_IN', {
      infer: true,
    });

    const signature = this.createSignature();
    const session = await SessionEntity.save(
      new SessionEntity({
        signature,
        user,
        expiresAt: new Date(Date.now() + ms(sessionExpiresIn)),
        createdBy: user.id,
      }),
    );

    const payload: JwtPayload = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
    };

    const refreshTokenExpiresIn = (ms(sessionExpiresIn) / 1000) as Seconds;

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(
        {
          ...payload,
          signature,
        } satisfies RefreshPayload,
        refreshTokenExpiresIn,
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async verifyPassword(
    hashed: string,
    plain: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashed, plain);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private createSignature() {
    return crypto.randomBytes(16).toString('hex');
  }

  private async commitOffsets(context: KafkaContext) {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([
      { topic, partition, offset: String(Number(offset) + 1) },
    ]);
  }
}
