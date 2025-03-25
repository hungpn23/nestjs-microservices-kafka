import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalExceptionsFilter implements RpcExceptionFilter {
  catch(exception: any, _host: ArgumentsHost): Observable<any> {
    const errorResponse = {
      status: 'error',
      message: exception.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    return throwError(() => new RpcException(errorResponse));
  }
}
