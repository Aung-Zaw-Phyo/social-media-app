import { HttpException, HttpStatus } from '@nestjs/common';


export const throwCustomError = (message: string, httpStatus: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY) => {
    throw new HttpException(
        { message: [message], error: 'Validation Error' },
        httpStatus,
    );
}