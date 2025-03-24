import { Public } from '@libs/decorators/auth/public.decorator';
import { RegisterDto } from '@libs/user.dto';
import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER') private readonly userClient: ClientKafka) {}

  onModuleInit() {
    this.userClient.subscribeToResponseOf('user.register');
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const observable = this.userClient.send<RegisterDto>('user.register', dto);

    const result = await firstValueFrom(
      observable.pipe(
        catchError((error) =>
          throwError(() => new HttpException(error.message, 400)),
        ),
      ),
    );

    console.log(result);

    return dto;
  }
}
