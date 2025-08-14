import { HttpException, HttpStatus } from '@nestjs/common';

export const throwCustomError = (message: string, httpStatus: HttpStatus) => {
    const error = HttpStatus[httpStatus].split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
    throw new HttpException(
        { message, error },
        httpStatus,
    );
}