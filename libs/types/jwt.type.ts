import { Role } from '@libs/constants/role.enum';
import { Seconds, UUID } from '@libs/types/branded.type';

type BaseJwtPayload = {
  sessionId: UUID;
  iat?: number;
  exp?: Seconds;
};

export type JwtPayload = BaseJwtPayload & { userId: UUID; role: Role };

export type RefreshPayload = JwtPayload & { signature: string };
