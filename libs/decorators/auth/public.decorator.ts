import { IS_PUBLIC } from '@libs/constants/metadata.const';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC, true);
