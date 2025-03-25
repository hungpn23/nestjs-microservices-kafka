import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalExceptionsFilter implements RpcExceptionFilter {
  catch(exception: any, _host: ArgumentsHost): Observable<RpcException> {
    return throwError(() => exception.message || 'Internal Server Error');
  }
}
