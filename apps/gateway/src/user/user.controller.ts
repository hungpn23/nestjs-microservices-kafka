import { Public } from '@libs/decorators/auth/public.decorator';
import { RegisterDto } from '@libs/dtos/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.userService.register(dto);
  }
}
