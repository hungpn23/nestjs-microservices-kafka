import { IS_REFRESH_TOKEN } from '@libs/constants/metadata.const';
import { SetMetadata } from '@nestjs/common';

export const RefreshToken = () => SetMetadata(IS_REFRESH_TOKEN, true);
