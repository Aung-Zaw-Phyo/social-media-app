import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something wrong';
    let error = 'Internal Server Error';
    
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      status = exception.getStatus();
      message = exceptionResponse.message || 'An error occurred';
      error = exceptionResponse.error || 'Server error';
    }
    response.status(status).json({
      success: false,
      message: message,
      error: error,
      statusCode: status,
      data: null,
    });
  }
}
