import { Public } from '@libs/decorators/auth/public.decorator';
import { Payload } from '@libs/decorators/jwt-payload.decorator';
import { ChangePasswordDto, LoginDto, RegisterDto } from '@libs/dtos/user.dto';
import { JwtPayload } from '@libs/types/jwt.type';
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

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.userService.login(dto);
  }

  @Post('logout')
  async logout(@Payload() payload: JwtPayload) {
    return await this.userService.logout(payload);
  }

  @Post('password/change')
  async changePassword(
    @Payload() { userId }: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(userId, dto);
  }

  @Post('address/add')
  async addAddress() {
    return await this.userService.addAddress();
  }
}
