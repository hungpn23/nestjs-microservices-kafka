import { ROLE } from '@libs/constants/metadata.const';
import { Role } from '@libs/constants/role.enum';
import { SetMetadata } from '@nestjs/common';

export const UseRole = (role: Role) => SetMetadata(ROLE, role);
